/* =========================================================
   PYTHON QUEST — pyrunner.js
   Menjalankan kode Python langsung di browser.
   1) Pyodide (Python asli via WebAssembly, dimuat dari CDN, berjalan di Web Worker)
   2) Fallback: "Mini Python" — interpreter sederhana buatan sendiri (JavaScript)
      dipakai saat Pyodide belum siap / tidak tersedia (offline).
   ========================================================= */

/* ======================= MINI PYTHON ======================= */
const MiniPy = (() => {
  class PyError extends Error {
    constructor(type, msg, line) { super(msg); this.pyType = type; this.line = line; }
  }
  class PyFloat { constructor(v) { this.v = v; } }
  const BREAK = { sig: "break" }, CONTINUE = { sig: "continue" };
  class ReturnSignal { constructor(v) { this.v = v; } }

  const KEYWORDS = new Set(["if", "elif", "else", "while", "for", "in", "def", "return", "break", "continue", "pass", "and", "or", "not", "import", "from", "global", "try", "except", "is", "class", "lambda", "del", "with", "as"]);
  const COMPOUND = new Set(["if", "elif", "else", "while", "for", "def", "try", "except", "finally"]);
  const OPS = ["**=", "//=", "==", "!=", "<=", ">=", "+=", "-=", "*=", "/=", "%=", "**", "//", "->", "(", ")", "[", "]", "{", "}", ",", ":", ".", "=", "+", "-", "*", "/", "%", "<", ">", ";"];

  /* ---------- Tokenizer ---------- */
  function tokenize(src, line) {
    const toks = [];
    let i = 0;
    while (i < src.length) {
      const c = src[i];
      if (c === " " || c === "\t" || c === "\r") { i++; continue; }
      if (c === "#") break;
      const rest = src.slice(i);
      let m = /^([fFrR]{0,2})("|')/.exec(rest);
      if (m) {
        const prefix = m[1].toLowerCase();
        const q = m[2];
        let j = i + m[0].length, s = "";
        while (j < src.length && src[j] !== q) {
          if (src[j] === "\\" && !prefix.includes("r") && j + 1 < src.length) {
            const n = src[j + 1];
            const map = { n: "\n", t: "\t", "\\": "\\", "'": "'", '"': '"' };
            s += n in map ? map[n] : "\\" + n;
            j += 2;
          } else { s += src[j]; j++; }
        }
        if (j >= src.length) throw new PyError("SyntaxError", "unterminated string literal", line);
        toks.push({ t: "str", v: s, f: prefix.includes("f") });
        i = j + 1;
        continue;
      }
      m = /^(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?/.exec(rest);
      if (m) {
        toks.push({ t: "num", v: m[0], isFloat: /[.eE]/.test(m[0]) });
        i += m[0].length;
        continue;
      }
      m = /^[A-Za-z_\u00C0-\uFFFF][\w\u00C0-\uFFFF]*/.exec(rest);
      if (m) { toks.push({ t: "name", v: m[0] }); i += m[0].length; continue; }
      const op = OPS.find((o) => src.startsWith(o, i));
      if (op) { toks.push({ t: "op", v: op }); i += op.length; continue; }
      throw new PyError("SyntaxError", `invalid character '${c}'`, line);
    }
    return toks;
  }

  function bracketDepth(text) {
    let d = 0, q = null;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === "\\") i++; else if (c === q) q = null; continue; }
      if (c === "#") break;
      if (c === '"' || c === "'") q = c;
      else if ("([{".includes(c)) d++;
      else if (")]}".includes(c)) d--;
    }
    return d;
  }

  function hasOpenQuote(text) {
    let q = null;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === "\\") i++; else if (c === q) q = null; continue; }
      if (c === "#") break;
      if (c === '"' || c === "'") q = c;
    }
    return q !== null;
  }

  /* ---------- Expression parser ---------- */
  class Parser {
    constructor(toks, line) { this.t = toks; this.p = 0; this.line = line; }
    peek(o = 0) { return this.t[this.p + o]; }
    isOp(v) { const k = this.peek(); return !!k && k.t === "op" && k.v === v; }
    isName(v) { const k = this.peek(); return !!k && k.t === "name" && k.v === v; }
    next() { return this.t[this.p++]; }
    atEnd() { return this.p >= this.t.length; }
    err(msg) { throw new PyError("SyntaxError", msg, this.line); }
    expectOp(v) { if (!this.isOp(v)) this.err(`expected '${v}'`); return this.next(); }
    exprList() {
      const first = this.expr();
      if (this.isOp(",")) {
        const items = [first];
        while (this.isOp(",")) { this.next(); if (this.atEnd() || this.isOp("=")) break; items.push(this.expr()); }
        return { k: "tuple", items };
      }
      return first;
    }
    expr() {
      const a = this.or();
      if (this.isName("if")) {
        this.next();
        const c = this.or();
        if (!this.isName("else")) this.err("expected 'else'");
        this.next();
        return { k: "ifexp", c, a, b: this.expr() };
      }
      return a;
    }
    or() { let a = this.and(); while (this.isName("or")) { this.next(); a = { k: "or", a, b: this.and() }; } return a; }
    and() { let a = this.not(); while (this.isName("and")) { this.next(); a = { k: "and", a, b: this.not() }; } return a; }
    not() { if (this.isName("not")) { this.next(); return { k: "not", a: this.not() }; } return this.cmp(); }
    cmp() {
      const first = this.arith();
      const ops = [], rest = [];
      for (;;) {
        const k = this.peek();
        if (!k) break;
        let op = null;
        if (k.t === "op" && ["==", "!=", "<", ">", "<=", ">="].includes(k.v)) { op = k.v; this.next(); }
        else if (k.t === "name" && k.v === "in") { op = "in"; this.next(); }
        else if (k.t === "name" && k.v === "not" && this.peek(1) && this.peek(1).v === "in") { op = "not in"; this.p += 2; }
        else if (k.t === "name" && k.v === "is") { this.next(); if (this.isName("not")) { this.next(); op = "is not"; } else op = "is"; }
        else break;
        ops.push(op);
        rest.push(this.arith());
      }
      return ops.length ? { k: "cmp", first, ops, rest } : first;
    }
    arith() { let a = this.term(); while (this.isOp("+") || this.isOp("-")) { const op = this.next().v; a = { k: "bin", op, a, b: this.term() }; } return a; }
    term() { let a = this.unary(); while (["*", "/", "//", "%"].some((o) => this.isOp(o))) { const op = this.next().v; a = { k: "bin", op, a, b: this.unary() }; } return a; }
    unary() {
      if (this.isOp("-")) { this.next(); return { k: "neg", a: this.unary() }; }
      if (this.isOp("+")) { this.next(); return this.unary(); }
      return this.power();
    }
    power() { const a = this.postfix(); if (this.isOp("**")) { this.next(); return { k: "bin", op: "**", a, b: this.unary() }; } return a; }
    postfix() {
      let e = this.atom();
      for (;;) {
        if (this.isOp("(")) {
          this.next();
          const args = [], kwargs = [];
          while (!this.isOp(")")) {
            if (this.atEnd()) this.err("'(' was never closed");
            const a = this.peek(), b = this.peek(1);
            if (a.t === "name" && b && b.t === "op" && b.v === "=") { this.p += 2; kwargs.push([a.v, this.expr()]); }
            else args.push(this.expr());
            if (this.isOp(",")) this.next(); else break;
          }
          this.expectOp(")");
          e = { k: "call", f: e, args, kwargs };
        } else if (this.isOp("[")) {
          this.next();
          const parts = [null, null, null];
          let isSlice = false, pi = 0;
          for (;;) {
            if (this.isOp(":")) { isSlice = true; this.next(); pi++; if (pi > 2) this.err("invalid slice"); continue; }
            if (this.isOp("]") || this.atEnd()) break;
            parts[pi] = this.expr();
            if (!this.isOp(":")) break;
          }
          this.expectOp("]");
          e = isSlice ? { k: "slice", obj: e, parts } : { k: "index", obj: e, idx: parts[0] };
        } else if (this.isOp(".")) {
          this.next();
          const n = this.next();
          if (!n || n.t !== "name") this.err("invalid syntax");
          e = { k: "attr", obj: e, name: n.v };
        } else break;
      }
      return e;
    }
    atom() {
      const k = this.next();
      if (!k) this.err("invalid syntax (ekspresi tidak lengkap)");
      if (k.t === "num") return { k: "const", v: k.isFloat ? new PyFloat(parseFloat(k.v)) : parseInt(k.v, 10) };
      if (k.t === "str") {
        const parts = [k];
        while (this.peek() && this.peek().t === "str") parts.push(this.next());
        if (parts.some((x) => x.f)) return { k: "fstr", parts: parts.map((x) => ({ f: x.f, v: x.v })) };
        return { k: "const", v: parts.map((x) => x.v).join("") };
      }
      if (k.t === "name") {
        if (k.v === "True") return { k: "const", v: true };
        if (k.v === "False") return { k: "const", v: false };
        if (k.v === "None") return { k: "const", v: null };
        if (KEYWORDS.has(k.v)) this.err("invalid syntax");
        return { k: "name", v: k.v };
      }
      if (k.v === "(") {
        if (this.isOp(")")) { this.next(); return { k: "tuple", items: [] }; }
        const e = this.expr();
        if (this.isOp(",")) {
          const items = [e];
          while (this.isOp(",")) { this.next(); if (this.isOp(")")) break; items.push(this.expr()); }
          this.expectOp(")");
          return { k: "tuple", items };
        }
        this.expectOp(")");
        return e;
      }
      if (k.v === "[") {
        if (this.isOp("]")) { this.next(); return { k: "list", items: [] }; }
        const first = this.expr();
        if (this.isName("for")) { const c = this.compTail(first); this.expectOp("]"); return c; }
        const items = [first];
        while (this.isOp(",")) { this.next(); if (this.isOp("]")) break; items.push(this.expr()); }
        this.expectOp("]");
        return { k: "list", items };
      }
      if (k.v === "{") {
        if (this.isOp("}")) { this.next(); return { k: "dict", pairs: [] }; }
        const first = this.expr();
        if (this.isOp(":")) {
          this.next();
          const pairs = [[first, this.expr()]];
          while (this.isOp(",")) { this.next(); if (this.isOp("}")) break; const kk = this.expr(); this.expectOp(":"); pairs.push([kk, this.expr()]); }
          this.expectOp("}");
          return { k: "dict", pairs };
        }
        const items = [first];
        while (this.isOp(",")) { this.next(); if (this.isOp("}")) break; items.push(this.expr()); }
        this.expectOp("}");
        return { k: "set", items };
      }
      this.err(`invalid syntax near '${k.v}'`);
    }
    compTail(elt) {
      this.next();
      const target = this.targetList();
      if (!this.isName("in")) this.err("expected 'in'");
      this.next();
      const iter = this.or();
      let cond = null;
      if (this.isName("if")) { this.next(); cond = this.or(); }
      return { k: "listcomp", elt, target, iter, cond };
    }
    targetList() {
      const items = [this.postfix()];
      while (this.isOp(",")) { this.next(); items.push(this.postfix()); }
      return items.length === 1 ? items[0] : { k: "tuple", items };
    }
  }

  function parseExpr(toks, line, list) {
    const p = new Parser(toks, line);
    const e = list ? p.exprList() : p.expr();
    if (!p.atEnd()) p.err(`invalid syntax near '${p.peek().v}'`);
    return e;
  }

  function splitTop(toks, pred) {
    const idx = [];
    let d = 0;
    toks.forEach((t, i) => {
      if (t.t === "op" && "([{".includes(t.v)) d++;
      else if (t.t === "op" && ")]}".includes(t.v)) d--;
      else if (d === 0 && pred(t)) idx.push(i);
    });
    return idx;
  }

  /* ---------- Statement parser ---------- */
  function parseSimple(toks, line) {
    const h = toks[0];
    if (h.t === "name") {
      switch (h.v) {
        case "pass": return { k: "pass", line };
        case "break": return { k: "break", line };
        case "continue": return { k: "continue", line };
        case "return": return { k: "return", e: toks.length > 1 ? parseExpr(toks.slice(1), line, true) : null, line };
        case "import": return { k: "import", names: toks.slice(1).filter((t) => t.t === "name").map((t) => t.v), line };
        case "from": {
          const mod = toks[1] && toks[1].v;
          const names = toks.slice(3).filter((t) => t.t === "name").map((t) => t.v);
          return { k: "from", mod, names, line };
        }
        case "global": return { k: "global", names: toks.slice(1).filter((t) => t.t === "name").map((t) => t.v), line };
        case "del": return { k: "del", target: parseExpr(toks.slice(1), line), line };
        case "class": case "lambda": case "with":
          throw new PyError("NotSupported", `'${h.v}' belum didukung mode Mini Python. Tunggu sampai Python asli (Pyodide) siap.`, line);
      }
    }
    const aug = splitTop(toks, (t) => t.t === "op" && ["+=", "-=", "*=", "/=", "//=", "%=", "**="].includes(t.v));
    if (aug.length) {
      const i = aug[0];
      return { k: "aug", op: toks[i].v.slice(0, -1), target: parseExpr(toks.slice(0, i), line), value: parseExpr(toks.slice(i + 1), line, true), line };
    }
    const eqs = splitTop(toks, (t) => t.t === "op" && t.v === "=");
    if (eqs.length) {
      const segs = [];
      let start = 0;
      eqs.forEach((i) => { segs.push(toks.slice(start, i)); start = i + 1; });
      segs.push(toks.slice(start));
      if (segs.some((s) => !s.length)) throw new PyError("SyntaxError", "invalid syntax", line);
      const value = parseExpr(segs.pop(), line, true);
      const targets = segs.map((s) => parseExpr(s, line, true));
      targets.forEach((t) => { if (!["name", "index", "tuple", "list", "attr"].includes(t.k)) throw new PyError("SyntaxError", "cannot assign to expression", line); });
      return { k: "assign", targets, value, line };
    }
    return { k: "expr", e: parseExpr(toks, line, true), line };
  }

  function parseCompound(kw, toks, body, line) {
    const rest = toks.slice(1);
    switch (kw) {
      case "if": return { k: "if", branches: [[parseExpr(rest, line), body]], orelse: null, line };
      case "elif": return { k: "elif", cond: parseExpr(rest, line), body, line };
      case "else": return { k: "else", body, line };
      case "while": return { k: "while", cond: parseExpr(rest, line), body, orelse: null, line };
      case "for": {
        const p = new Parser(rest, line);
        const target = p.targetList();
        if (!p.isName("in")) p.err("expected 'in'");
        p.next();
        const iter = p.exprList();
        if (!p.atEnd()) p.err("invalid syntax");
        return { k: "for", target, iter, body, orelse: null, line };
      }
      case "def": {
        const name = rest[0];
        if (!name || name.t !== "name") throw new PyError("SyntaxError", "invalid function name", line);
        if (!rest[1] || rest[1].v !== "(") throw new PyError("SyntaxError", "expected '('", line);
        const close = rest.length - 1;
        if (rest[close].v !== ")") throw new PyError("SyntaxError", "expected ')'", line);
        const inner = rest.slice(2, close);
        const params = [];
        if (inner.length) {
          const commas = splitTop(inner, (t) => t.t === "op" && t.v === ",");
          let s = 0;
          [...commas, inner.length].forEach((ci) => {
            const seg = inner.slice(s, ci);
            s = ci + 1;
            if (!seg.length) return;
            const pname = seg[0].v;
            const def = seg.length > 2 && seg[1].v === "=" ? parseExpr(seg.slice(2), line) : null;
            params.push({ name: pname, def });
          });
        }
        return { k: "def", name: name.v, params, body, line };
      }
      case "try": return { k: "try", body, handlers: [], line };
      case "except": {
        let type = null, as = null;
        if (rest.length) { type = rest[0].v; const ai = rest.findIndex((t) => t.v === "as"); if (ai >= 0 && rest[ai + 1]) as = rest[ai + 1].v; }
        return { k: "except", type, as, body, line };
      }
      case "finally": return { k: "finally", body, line };
    }
  }

  function buildBlock(lines, start, indent) {
    const body = [];
    let i = start;
    while (i < lines.length) {
      const L = lines[i];
      if (L.indent < indent) break;
      if (L.indent > indent) throw new PyError("IndentationError", "unexpected indent", L.line);
      const toks = L.toks;
      const h = toks[0];
      if (h.t === "name" && COMPOUND.has(h.v)) {
        const ci = splitTop(toks, (t) => t.t === "op" && t.v === ":")[0];
        if (ci === undefined) throw new PyError("SyntaxError", "expected ':'", L.line);
        const after = toks.slice(ci + 1);
        let inner, nextI;
        if (after.length) { inner = [parseSimple(after, L.line)]; nextI = i + 1; }
        else {
          const nl = lines[i + 1];
          if (!nl || nl.indent <= indent) throw new PyError("IndentationError", "expected an indented block", L.line);
          const r = buildBlock(lines, i + 1, nl.indent);
          inner = r.body;
          nextI = r.next;
        }
        const st = parseCompound(h.v, toks.slice(0, ci), inner, L.line);
        const prev = body[body.length - 1];
        if (st.k === "elif") {
          if (!prev || prev.k !== "if" || prev.orelse) throw new PyError("SyntaxError", "'elif' tanpa 'if' sebelumnya", L.line);
          prev.branches.push([st.cond, st.body]);
        } else if (st.k === "else") {
          if (!prev || !["if", "for", "while", "try"].includes(prev.k) || prev.orelse) throw new PyError("SyntaxError", "'else' tanpa 'if' sebelumnya", L.line);
          prev.orelse = st.body;
        } else if (st.k === "except") {
          if (!prev || prev.k !== "try") throw new PyError("SyntaxError", "'except' tanpa 'try'", L.line);
          prev.handlers.push(st);
        } else if (st.k === "finally") {
          if (!prev || prev.k !== "try") throw new PyError("SyntaxError", "'finally' tanpa 'try'", L.line);
          prev.final = st.body;
        } else body.push(st);
        i = nextI;
      } else {
        // dukung beberapa statement dipisah ';'
        const semis = splitTop(toks, (t) => t.t === "op" && t.v === ";");
        let s = 0;
        [...semis, toks.length].forEach((ci) => { const seg = toks.slice(s, ci); s = ci + 1; if (seg.length) body.push(parseSimple(seg, L.line)); });
        i++;
      }
    }
    return { body, next: i };
  }

  function parseProgram(code) {
    const raw = code.replace(/\t/g, "    ").split("\n");
    const lines = [];
    for (let i = 0; i < raw.length; i++) {
      let text = raw[i];
      const lineNo = i + 1;
      if (!text.trim() || text.trim().startsWith("#")) continue;
      if (hasOpenQuote(text)) throw new PyError("SyntaxError", "unterminated string literal", lineNo);
      while (bracketDepth(text) > 0 && i + 1 < raw.length) { i++; text += " " + raw[i].trim(); }
      if (bracketDepth(text) > 0) throw new PyError("SyntaxError", "'(' was never closed", lineNo);
      if (bracketDepth(text) < 0) throw new PyError("SyntaxError", "unmatched ')'", lineNo);
      const indent = text.match(/^ */)[0].length;
      const toks = tokenize(text, lineNo);
      if (!toks.length) continue;
      lines.push({ indent, toks, line: lineNo });
    }
    if (!lines.length) return [];
    if (lines[0].indent > 0) throw new PyError("IndentationError", "unexpected indent", lines[0].line);
    return buildBlock(lines, 0, 0).body;
  }

  /* ---------- Value helpers ---------- */
  const isNum = (x) => typeof x === "number" || x instanceof PyFloat || typeof x === "boolean";
  const num = (x) => (x instanceof PyFloat ? x.v : x === true ? 1 : x === false ? 0 : x);
  const isInt = (x) => typeof x === "number" || typeof x === "boolean";
  const mkNum = (v, fl) => (fl ? new PyFloat(v) : v);
  const tuple = (arr) => { arr.__tuple = true; return arr; };

  function typeName(x) {
    if (x === null || x === undefined) return "NoneType";
    if (typeof x === "boolean") return "bool";
    if (typeof x === "number") return "int";
    if (x instanceof PyFloat) return "float";
    if (typeof x === "string") return "str";
    if (Array.isArray(x)) return x.__tuple ? "tuple" : x.__range ? "range" : "list";
    if (x instanceof Map) return "dict";
    if (x instanceof Set) return "set";
    if (x.__pyfunc || typeof x === "function") return "function";
    if (x.__module) return "module";
    if (x.__type) return "type";
    return "object";
  }
  function fmtFloat(v) {
    if (!isFinite(v)) return v > 0 ? "inf" : v < 0 ? "-inf" : "nan";
    if (Number.isInteger(v) && Math.abs(v) < 1e16) return v.toFixed(1);
    return String(v).replace(/e([+-])(\d)$/, "e$10$2");
  }
  function reprStr(s) {
    const q = s.includes("'") && !s.includes('"') ? '"' : "'";
    return q + s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(q === "'" ? /'/g : /"/g, "\\" + q) + q;
  }
  function pyRepr(x) {
    if (x === null || x === undefined) return "None";
    if (x === true) return "True";
    if (x === false) return "False";
    if (typeof x === "number") return String(x);
    if (x instanceof PyFloat) return fmtFloat(x.v);
    if (typeof x === "string") return reprStr(x);
    if (Array.isArray(x)) {
      if (x.__range) return `range(${x.__range.join(", ")})`;
      const inner = x.map(pyRepr).join(", ");
      return x.__tuple ? (x.length === 1 ? `(${inner},)` : `(${inner})`) : `[${inner}]`;
    }
    if (x instanceof Map) return "{" + [...x].map(([k, v]) => pyRepr(k) + ": " + pyRepr(v)).join(", ") + "}";
    if (x instanceof Set) return x.size ? "{" + [...x].map(pyRepr).join(", ") + "}" : "set()";
    if (x.__pyfunc) return `<function ${x.name}>`;
    if (x.__type) return `<class '${x.__type}'>`;
    if (x.__module) return `<module '${x.__module}'>`;
    if (typeof x === "function") return `<built-in function ${x.pyName || "function"}>`;
    return String(x);
  }
  const pyStr = (x) => (typeof x === "string" ? x : pyRepr(x));
  function truthy(x) {
    if (x === null || x === undefined || x === false) return false;
    if (typeof x === "number") return x !== 0;
    if (x instanceof PyFloat) return x.v !== 0;
    if (typeof x === "string" || Array.isArray(x)) return x.length > 0;
    if (x instanceof Map || x instanceof Set) return x.size > 0;
    return true;
  }
  function eq(a, b) {
    if (isNum(a) && isNum(b)) return num(a) === num(b);
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && !!a.__tuple === !!b.__tuple && a.every((v, i) => eq(v, b[i]));
    if (a instanceof Map && b instanceof Map) return a.size === b.size && [...a].every(([k, v]) => b.has(k) && eq(v, b.get(k)));
    if (a instanceof Set && b instanceof Set) return a.size === b.size && [...a].every((v) => b.has(v));
    if (a === undefined) a = null;
    if (b === undefined) b = null;
    return a === b;
  }
  const normKey = (k) => (k instanceof PyFloat && Number.isInteger(k.v) ? k.v : k);

  /* ---------- Interpreter ---------- */
  function run(code, inputs) {
    const out = [];
    let outLen = 0;
    let steps = 0, depth = 0, curLine = 0;
    const MAX_STEPS = 400000;
    const inQueue = (inputs || []).slice();

    const write = (s) => {
      outLen += s.length;
      if (outLen > 200000) throw new PyError("OutputError", "Output terlalu banyak. Mungkin ada loop yang tidak berhenti?", curLine);
      out.push(s);
    };
    const tick = () => {
      if (++steps > MAX_STEPS) throw new PyError("TimeoutError", "Program berjalan terlalu lama. Mungkin ada loop yang tidak pernah berhenti?", curLine);
    };
    const E = (type, msg) => new PyError(type, msg, curLine);

    function iterate(x) {
      if (typeof x === "string") return [...x];
      if (Array.isArray(x)) return x.slice();
      if (x instanceof Map) return [...x.keys()];
      if (x instanceof Set) return [...x];
      throw E("TypeError", `'${typeName(x)}' object is not iterable`);
    }
    function compare(op, a, b) {
      switch (op) {
        case "==": return eq(a, b);
        case "!=": return !eq(a, b);
        case "in": return contains(b, a);
        case "not in": return !contains(b, a);
        case "is": return a === b || (a == null && b == null);
        case "is not": return !(a === b || (a == null && b == null));
      }
      let x, y;
      if (isNum(a) && isNum(b)) { x = num(a); y = num(b); }
      else if (typeof a === "string" && typeof b === "string") { x = a; y = b; }
      else throw E("TypeError", `'${op}' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
      return op === "<" ? x < y : op === ">" ? x > y : op === "<=" ? x <= y : x >= y;
    }
    function contains(c, item) {
      if (typeof c === "string") {
        if (typeof item !== "string") throw E("TypeError", `'in <string>' requires string as left operand, not ${typeName(item)}`);
        return c.includes(item);
      }
      if (Array.isArray(c)) return c.some((v) => eq(v, item));
      if (c instanceof Map) return c.has(normKey(item));
      if (c instanceof Set) return c.has(normKey(item));
      throw E("TypeError", `argument of type '${typeName(c)}' is not iterable`);
    }
    function binop(op, a, b) {
      if (op === "+") {
        if (typeof a === "string" && typeof b === "string") return a + b;
        if (typeof a === "string") throw E("TypeError", `can only concatenate str (not "${typeName(b)}") to str`);
        if (Array.isArray(a) && Array.isArray(b) && !!a.__tuple === !!b.__tuple) { const r = a.concat(b); if (a.__tuple) r.__tuple = true; return r; }
        if (Array.isArray(a) && Array.isArray(b)) throw E("TypeError", `can only concatenate ${typeName(a)} (not "${typeName(b)}") to ${typeName(a)}`);
      }
      if (op === "*") {
        if (typeof a === "string" && isInt(b)) return a.repeat(Math.max(0, num(b)));
        if (isInt(a) && typeof b === "string") return b.repeat(Math.max(0, num(a)));
        if (Array.isArray(a) && isInt(b)) { let r = []; for (let i = 0; i < num(b); i++) r = r.concat(a); return r; }
      }
      if (isNum(a) && isNum(b)) {
        const x = num(a), y = num(b);
        const fl = a instanceof PyFloat || b instanceof PyFloat;
        switch (op) {
          case "+": return mkNum(x + y, fl);
          case "-": return mkNum(x - y, fl);
          case "*": return mkNum(x * y, fl);
          case "/": if (y === 0) throw E("ZeroDivisionError", "division by zero"); return new PyFloat(x / y);
          case "//": if (y === 0) throw E("ZeroDivisionError", "integer division or modulo by zero"); return mkNum(Math.floor(x / y), fl);
          case "%": if (y === 0) throw E("ZeroDivisionError", "integer modulo by zero"); return mkNum(((x % y) + y) % y, fl);
          case "**": return mkNum(Math.pow(x, y), fl || y < 0);
        }
      }
      throw E("TypeError", `unsupported operand type(s) for ${op}: '${typeName(a)}' and '${typeName(b)}'`);
    }
    function idxOf(obj, i) {
      if (!isInt(i)) throw E("TypeError", `${typeName(obj)} indices must be integers or slices, not ${typeName(i)}`);
      let n = num(i);
      if (n < 0) n += obj.length;
      if (n < 0 || n >= obj.length) throw E("IndexError", `${typeName(obj) === "str" ? "string" : typeName(obj)} index out of range`);
      return n;
    }
    function getItem(obj, i) {
      if (typeof obj === "string" || Array.isArray(obj)) return obj[idxOf(obj, i)];
      if (obj instanceof Map) {
        const k = normKey(i);
        if (!obj.has(k)) throw E("KeyError", pyRepr(i));
        return obj.get(k);
      }
      throw E("TypeError", `'${typeName(obj)}' object is not subscriptable`);
    }
    function setItem(obj, i, v) {
      if (Array.isArray(obj) && !obj.__tuple) { obj[idxOf(obj, i)] = v; return; }
      if (obj instanceof Map) { obj.set(normKey(i), v); return; }
      throw E("TypeError", `'${typeName(obj)}' object does not support item assignment`);
    }
    function sliceOf(obj, parts) {
      const [a, b, c] = parts;
      const len = obj.length;
      const step = c == null ? 1 : num(c);
      if (step === 0) throw E("ValueError", "slice step cannot be zero");
      const idx = [];
      if (step > 0) {
        let s = a == null ? 0 : num(a) < 0 ? Math.max(0, len + num(a)) : Math.min(num(a), len);
        const e = b == null ? len : num(b) < 0 ? Math.max(0, len + num(b)) : Math.min(num(b), len);
        for (; s < e; s += step) idx.push(s);
      } else {
        let s = a == null ? len - 1 : num(a) < 0 ? len + num(a) : Math.min(num(a), len - 1);
        const e = b == null ? -1 : num(b) < 0 ? Math.max(-1, len + num(b)) : num(b);
        for (; s > e; s += step) idx.push(s);
      }
      if (typeof obj === "string") return idx.map((i) => obj[i]).join("");
      const r = idx.map((i) => obj[i]);
      if (obj.__tuple) r.__tuple = true;
      return r;
    }
    function sortKey(a, b) { return compare("<", a, b) ? -1 : compare(">", a, b) ? 1 : 0; }
    function makeRange(args) {
      const n = args.map((x) => { if (!isInt(x)) throw E("TypeError", `'${typeName(x)}' object cannot be interpreted as an integer`); return num(x); });
      let [start, stop, step] = n.length === 1 ? [0, n[0], 1] : [n[0], n[1], n[2] == null ? 1 : n[2]];
      if (step === 0) throw E("ValueError", "range() arg 3 must not be zero");
      const r = [];
      if (step > 0) for (let i = start; i < stop; i += step) { r.push(i); if (r.length > 1e6) throw E("MemoryError", "range terlalu besar"); }
      else for (let i = start; i > stop; i += step) { r.push(i); if (r.length > 1e6) throw E("MemoryError", "range terlalu besar"); }
      r.__range = n;
      return r;
    }
    function applySpec(v, spec) {
      if (!spec) return pyStr(v);
      const m = /^(.?[<>^])?(\d*)(,?)(?:\.(\d+))?([fd%s]?)$/.exec(spec);
      if (!m) return pyStr(v);
      let s;
      const [, align, width, comma, prec, type] = m;
      if (type === "%") s = (num(v) * 100).toFixed(prec ? +prec : 6) + "%";
      else if (prec != null && isNum(v)) s = num(v).toFixed(+prec);
      else if (type === "f") s = num(v).toFixed(6);
      else s = pyStr(v);
      if (comma && isNum(v)) { const [ip, dp] = s.split("."); s = ip.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (dp != null ? "." + dp : ""); }
      if (width) {
        const w = +width;
        const fill = align && align.length === 2 ? align[0] : " ";
        const al = align ? align[align.length - 1] : isNum(v) ? ">" : "<";
        if (s.length < w) {
          const pad = w - s.length;
          if (al === ">") s = fill.repeat(pad) + s;
          else if (al === "^") s = fill.repeat(Math.floor(pad / 2)) + s + fill.repeat(Math.ceil(pad / 2));
          else s = s + fill.repeat(pad);
        }
      }
      return s;
    }
    function fstring(src, env) {
      let res = "", i = 0;
      while (i < src.length) {
        const c = src[i];
        if (c === "{" && src[i + 1] === "{") { res += "{"; i += 2; continue; }
        if (c === "}" && src[i + 1] === "}") { res += "}"; i += 2; continue; }
        if (c === "{") {
          let j = i + 1, d = 0, q = null;
          for (; j < src.length; j++) {
            const ch = src[j];
            if (q) { if (ch === q) q = null; continue; }
            if (ch === "'" || ch === '"') q = ch;
            else if ("([{".includes(ch)) d++;
            else if (")]}".includes(ch)) { if (d === 0) break; d--; }
          }
          if (j >= src.length) throw E("SyntaxError", "f-string: expecting '}'");
          const inner = src.slice(i + 1, j);
          let colon = -1; d = 0; q = null;
          for (let k = 0; k < inner.length; k++) {
            const ch = inner[k];
            if (q) { if (ch === q) q = null; continue; }
            if (ch === "'" || ch === '"') q = ch;
            else if ("([{".includes(ch)) d++;
            else if (")]}".includes(ch)) d--;
            else if (ch === ":" && d === 0) { colon = k; break; }
          }
          const exprSrc = colon >= 0 ? inner.slice(0, colon) : inner;
          const spec = colon >= 0 ? inner.slice(colon + 1) : "";
          const val = ev(parseExpr(tokenize(exprSrc, curLine), curLine), env);
          res += applySpec(val, spec);
          i = j + 1;
          continue;
        }
        res += c;
        i++;
      }
      return res;
    }

    /* ----- builtins ----- */
    const B = new Map();
    const def = (name, fn) => { fn.pyName = name; B.set(name, fn); };
    def("print", (args, kw) => {
      const sep = kw.sep != null ? pyStr(kw.sep) : " ";
      const end = kw.end != null ? pyStr(kw.end) : "\n";
      write(args.map(pyStr).join(sep) + end);
      return null;
    });
    def("input", (args) => {
      const prompt = args.length ? pyStr(args[0]) : "";
      write(prompt);
      const v = inQueue.length ? String(inQueue.shift()) : "";
      write(v + "\n");
      return v;
    });
    def("len", (a) => {
      const x = a[0];
      if (typeof x === "string" || Array.isArray(x)) return x.length;
      if (x instanceof Map || x instanceof Set) return x.size;
      throw E("TypeError", `object of type '${typeName(x)}' has no len()`);
    });
    def("int", (a) => {
      const x = a.length ? a[0] : 0;
      if (typeof x === "string") {
        const s = x.trim().replace(/_/g, "");
        if (!/^[+-]?\d+$/.test(s)) throw E("ValueError", `invalid literal for int() with base 10: ${reprStr(x)}`);
        return parseInt(s, 10);
      }
      if (isNum(x)) return Math.trunc(num(x));
      throw E("TypeError", `int() argument must be a string or a number, not '${typeName(x)}'`);
    });
    def("float", (a) => {
      const x = a.length ? a[0] : 0;
      if (typeof x === "string") {
        const s = x.trim();
        if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s)) throw E("ValueError", `could not convert string to float: ${reprStr(x)}`);
        return new PyFloat(parseFloat(s));
      }
      if (isNum(x)) return new PyFloat(num(x));
      throw E("TypeError", `float() argument must be a string or a number, not '${typeName(x)}'`);
    });
    def("str", (a) => (a.length ? pyStr(a[0]) : ""));
    def("bool", (a) => (a.length ? truthy(a[0]) : false));
    def("type", (a) => ({ __type: typeName(a[0]) }));
    def("range", (a) => makeRange(a));
    def("abs", (a) => mkNum(Math.abs(num(a[0])), a[0] instanceof PyFloat));
    def("round", (a) => {
      const x = num(a[0]);
      if (a.length > 1 && a[1] != null) return new PyFloat(Number(x.toFixed(num(a[1]))));
      const f = Math.floor(x), diff = x - f;
      if (diff === 0.5) return f % 2 === 0 ? f : f + 1;
      return Math.round(x);
    });
    const minmax = (isMin) => (a) => {
      const items = a.length === 1 ? iterate(a[0]) : a;
      if (!items.length) throw E("ValueError", `${isMin ? "min" : "max"}() arg is an empty sequence`);
      return items.reduce((m, v) => (compare(isMin ? "<" : ">", v, m) ? v : m));
    };
    def("min", minmax(true));
    def("max", minmax(false));
    def("sum", (a) => iterate(a[0]).reduce((s, v) => binop("+", s, v), a[1] != null ? a[1] : 0));
    def("list", (a) => (a.length ? iterate(a[0]) : []));
    def("tuple", (a) => tuple(a.length ? iterate(a[0]) : []));
    def("set", (a) => new Set(a.length ? iterate(a[0]).map(normKey) : []));
    def("dict", (a, kw) => {
      const m = new Map();
      if (a[0] instanceof Map) a[0].forEach((v, k) => m.set(k, v));
      Object.keys(kw).forEach((k) => m.set(k, kw[k]));
      return m;
    });
    def("sorted", (a, kw) => { const r = iterate(a[0]).sort(sortKey); if (truthy(kw.reverse)) r.reverse(); return r; });
    def("reversed", (a) => iterate(a[0]).reverse());
    def("enumerate", (a, kw) => { const st = a[1] != null ? num(a[1]) : kw.start != null ? num(kw.start) : 0; return iterate(a[0]).map((v, i) => tuple([i + st, v])); });
    def("zip", (a) => { const its = a.map(iterate); const n = Math.min(...its.map((x) => x.length)); const r = []; for (let i = 0; i < n; i++) r.push(tuple(its.map((x) => x[i]))); return r; });
    def("isinstance", (a) => { const t = a[1] && a[1].pyName; return typeName(a[0]) === t; });
    def("chr", (a) => String.fromCharCode(num(a[0])));
    def("ord", (a) => String(a[0]).charCodeAt(0));

    const MODULES = {
      random: {
        __module: "random",
        randint: (a) => { const lo = num(a[0]), hi = num(a[1]); return lo + Math.floor(Math.random() * (hi - lo + 1)); },
        randrange: (a) => { const r = makeRange(a); return r[Math.floor(Math.random() * r.length)]; },
        choice: (a) => { const s = iterate(a[0]); if (!s.length) throw E("IndexError", "Cannot choose from an empty sequence"); return s[Math.floor(Math.random() * s.length)]; },
        random: () => new PyFloat(Math.random()),
        shuffle: (a) => { const l = a[0]; for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } return null; },
      },
      math: {
        __module: "math",
        pi: new PyFloat(Math.PI),
        sqrt: (a) => new PyFloat(Math.sqrt(num(a[0]))),
        floor: (a) => Math.floor(num(a[0])),
        ceil: (a) => Math.ceil(num(a[0])),
        pow: (a) => new PyFloat(Math.pow(num(a[0]), num(a[1]))),
      },
      time: { __module: "time", sleep: () => null },
    };

    function getAttr(obj, name) {
      if (obj && obj.__module) {
        if (name in obj) return obj[name];
        throw E("AttributeError", `module '${obj.__module}' has no attribute '${name}'`);
      }
      const m = methods(obj, name);
      if (m) { m.pyName = name; return m; }
      throw E("AttributeError", `'${typeName(obj)}' object has no attribute '${name}'`);
    }
    function methods(o, name) {
      if (typeof o === "string") {
        const S = {
          upper: () => o.toUpperCase(), lower: () => o.toLowerCase(),
          strip: (a) => (a[0] ? o.replace(new RegExp(`^[${esc(a[0])}]+|[${esc(a[0])}]+$`, "g"), "") : o.trim()),
          lstrip: () => o.replace(/^\s+/, ""), rstrip: () => o.replace(/\s+$/, ""),
          split: (a) => (a[0] == null ? o.trim().split(/\s+/).filter(Boolean) : o.split(a[0])),
          join: (a) => iterate(a[0]).map((x) => { if (typeof x !== "string") throw E("TypeError", `sequence item: expected str instance, ${typeName(x)} found`); return x; }).join(o),
          replace: (a) => o.split(pyStr(a[0])).join(pyStr(a[1])),
          title: () => o.toLowerCase().replace(/(^|[^a-zA-Z])([a-z])/g, (m0, p, c) => p + c.toUpperCase()),
          capitalize: () => o.charAt(0).toUpperCase() + o.slice(1).toLowerCase(),
          count: (a) => (a[0] === "" ? o.length + 1 : o.split(a[0]).length - 1),
          startswith: (a) => o.startsWith(a[0]), endswith: (a) => o.endsWith(a[0]),
          find: (a) => o.indexOf(a[0]),
          index: (a) => { const i = o.indexOf(a[0]); if (i < 0) throw E("ValueError", "substring not found"); return i; },
          isdigit: () => /^\d+$/.test(o), isnumeric: () => /^\d+$/.test(o), isalpha: () => /^[A-Za-z]+$/.test(o),
          isupper: () => o === o.toUpperCase() && /[A-Z]/.test(o), islower: () => o === o.toLowerCase() && /[a-z]/.test(o),
          format: (a) => { let i = 0; return o.replace(/\{(\d*)\}/g, (m0, n) => pyStr(n !== "" ? a[+n] : a[i++])); },
          zfill: (a) => o.padStart(num(a[0]), "0"), center: (a) => applySpec(o, "^" + num(a[0])),
        };
        return S[name];
      }
      if (Array.isArray(o) && !o.__tuple) {
        const L = {
          append: (a) => { o.push(a[0]); return null; },
          extend: (a) => { o.push(...iterate(a[0])); return null; },
          insert: (a) => { let i = num(a[0]); if (i < 0) i = Math.max(0, o.length + i); o.splice(i, 0, a[1]); return null; },
          remove: (a) => { const i = o.findIndex((v) => eq(v, a[0])); if (i < 0) throw E("ValueError", "list.remove(x): x not in list"); o.splice(i, 1); return null; },
          pop: (a) => { if (!o.length) throw E("IndexError", "pop from empty list"); if (!a.length) return o.pop(); const i = idxOf(o, a[0]); return o.splice(i, 1)[0]; },
          index: (a) => { const i = o.findIndex((v) => eq(v, a[0])); if (i < 0) throw E("ValueError", `${pyRepr(a[0])} is not in list`); return i; },
          count: (a) => o.filter((v) => eq(v, a[0])).length,
          sort: (a, kw) => { o.sort(sortKey); if (truthy(kw.reverse)) o.reverse(); return null; },
          reverse: () => { o.reverse(); return null; },
          clear: () => { o.length = 0; return null; },
          copy: () => o.slice(),
        };
        return L[name];
      }
      if (Array.isArray(o) && o.__tuple) {
        const T = { index: (a) => o.findIndex((v) => eq(v, a[0])), count: (a) => o.filter((v) => eq(v, a[0])).length };
        return T[name];
      }
      if (o instanceof Map) {
        const D = {
          get: (a) => (o.has(normKey(a[0])) ? o.get(normKey(a[0])) : a.length > 1 ? a[1] : null),
          keys: () => [...o.keys()], values: () => [...o.values()],
          items: () => [...o].map(([k, v]) => tuple([k, v])),
          pop: (a) => { const k = normKey(a[0]); if (o.has(k)) { const v = o.get(k); o.delete(k); return v; } if (a.length > 1) return a[1]; throw E("KeyError", pyRepr(a[0])); },
          update: (a) => { if (a[0] instanceof Map) a[0].forEach((v, k) => o.set(k, v)); return null; },
          clear: () => { o.clear(); return null; },
          copy: () => new Map(o),
          setdefault: (a) => { const k = normKey(a[0]); if (!o.has(k)) o.set(k, a.length > 1 ? a[1] : null); return o.get(k); },
        };
        return D[name];
      }
      if (o instanceof Set) {
        const St = {
          add: (a) => { o.add(normKey(a[0])); return null; },
          remove: (a) => { if (!o.has(normKey(a[0]))) throw E("KeyError", pyRepr(a[0])); o.delete(normKey(a[0])); return null; },
          discard: (a) => { o.delete(normKey(a[0])); return null; },
          union: (a) => new Set([...o, ...iterate(a[0])]),
          intersection: (a) => { const s = new Set(iterate(a[0])); return new Set([...o].filter((x) => s.has(x))); },
          difference: (a) => { const s = new Set(iterate(a[0])); return new Set([...o].filter((x) => !s.has(x))); },
        };
        return St[name];
      }
      return null;
    }
    const esc = (s) => String(s).replace(/[\]\\^-]/g, "\\$&");

    const globals = { vars: new Map(), globalDecl: new Set(), isGlobal: true };

    function lookup(name, env) {
      if (env.vars.has(name)) return env.vars.get(name);
      if (globals.vars.has(name)) return globals.vars.get(name);
      if (B.has(name)) return B.get(name);
      throw E("NameError", `name '${name}' is not defined`);
    }
    function setVar(name, v, env) {
      if (!env.isGlobal && env.globalDecl.has(name)) globals.vars.set(name, v);
      else env.vars.set(name, v);
    }
    function assignTo(t, v, env) {
      if (t.k === "name") return setVar(t.v, v, env);
      if (t.k === "index") return setItem(ev(t.obj, env), ev(t.idx, env), v);
      if (t.k === "tuple" || t.k === "list") {
        const items = iterate(v);
        if (items.length > t.items.length) throw E("ValueError", `too many values to unpack (expected ${t.items.length})`);
        if (items.length < t.items.length) throw E("ValueError", `not enough values to unpack (expected ${t.items.length}, got ${items.length})`);
        t.items.forEach((ti, i) => assignTo(ti, items[i], env));
        return;
      }
      throw E("SyntaxError", "cannot assign to expression");
    }
    function callFn(f, args, kwargs) {
      if (f && f.__pyfunc) {
        if (++depth > 300) throw E("RecursionError", "maximum recursion depth exceeded");
        const env = { vars: new Map(), globalDecl: new Set(), isGlobal: false };
        const ps = f.params;
        if (args.length > ps.length) throw E("TypeError", `${f.name}() takes ${ps.length} positional argument${ps.length === 1 ? "" : "s"} but ${args.length} ${args.length === 1 ? "was" : "were"} given`);
        ps.forEach((p, i) => {
          if (i < args.length) env.vars.set(p.name, args[i]);
          else if (p.name in kwargs) env.vars.set(p.name, kwargs[p.name]);
          else if (p.def !== undefined) env.vars.set(p.name, p.def);
        });
        Object.keys(kwargs).forEach((k) => { if (!ps.some((p) => p.name === k)) throw E("TypeError", `${f.name}() got an unexpected keyword argument '${k}'`); });
        const missing = ps.filter((p) => !env.vars.has(p.name)).map((p) => `'${p.name}'`);
        if (missing.length) throw E("TypeError", `${f.name}() missing ${missing.length} required positional argument${missing.length > 1 ? "s" : ""}: ${missing.join(" and ")}`);
        const saved = curLine;
        try { execBlock(f.body, env); }
        catch (x) { if (x instanceof ReturnSignal) { depth--; curLine = saved; return x.v; } throw x; }
        depth--;
        curLine = saved;
        return null;
      }
      if (typeof f === "function") return f(args, kwargs);
      throw E("TypeError", `'${typeName(f)}' object is not callable`);
    }

    function ev(e, env) {
      switch (e.k) {
        case "const": return e.v;
        case "name": return lookup(e.v, env);
        case "fstr": return e.parts.map((p) => (p.f ? fstring(p.v, env) : p.v)).join("");
        case "tuple": return tuple(e.items.map((x) => ev(x, env)));
        case "list": return e.items.map((x) => ev(x, env));
        case "dict": { const m = new Map(); e.pairs.forEach(([k, v]) => m.set(normKey(ev(k, env)), ev(v, env))); return m; }
        case "set": return new Set(e.items.map((x) => normKey(ev(x, env))));
        case "listcomp": {
          const r = [];
          for (const item of iterate(ev(e.iter, env))) {
            tick();
            assignTo(e.target, item, env);
            if (!e.cond || truthy(ev(e.cond, env))) r.push(ev(e.elt, env));
          }
          return r;
        }
        case "ifexp": return truthy(ev(e.c, env)) ? ev(e.a, env) : ev(e.b, env);
        case "or": { const a = ev(e.a, env); return truthy(a) ? a : ev(e.b, env); }
        case "and": { const a = ev(e.a, env); return !truthy(a) ? a : ev(e.b, env); }
        case "not": return !truthy(ev(e.a, env));
        case "neg": { const a = ev(e.a, env); if (!isNum(a)) throw E("TypeError", `bad operand type for unary -: '${typeName(a)}'`); return mkNum(-num(a), a instanceof PyFloat); }
        case "bin": return binop(e.op, ev(e.a, env), ev(e.b, env));
        case "cmp": {
          let left = ev(e.first, env);
          for (let i = 0; i < e.ops.length; i++) {
            const right = ev(e.rest[i], env);
            if (!compare(e.ops[i], left, right)) return false;
            left = right;
          }
          return true;
        }
        case "call": {
          const f = ev(e.f, env);
          const args = e.args.map((a) => ev(a, env));
          const kw = {};
          e.kwargs.forEach(([k, v]) => { kw[k] = ev(v, env); });
          return callFn(f, args, kw);
        }
        case "index": if (!e.idx) throw E("SyntaxError", "invalid syntax"); return getItem(ev(e.obj, env), ev(e.idx, env));
        case "slice": {
          const o = ev(e.obj, env);
          if (typeof o !== "string" && !Array.isArray(o)) throw E("TypeError", `'${typeName(o)}' object is not subscriptable`);
          return sliceOf(o, e.parts.map((p) => (p ? ev(p, env) : null)));
        }
        case "attr": return getAttr(ev(e.obj, env), e.name);
      }
      throw E("SyntaxError", "invalid syntax");
    }

    function execBlock(body, env) { for (const s of body) execStmt(s, env); }
    function loopBody(body, env) {
      try { execBlock(body, env); } catch (x) {
        if (x === BREAK) return "break";
        if (x === CONTINUE) return "continue";
        throw x;
      }
      return null;
    }
    function execStmt(s, env) {
      tick();
      curLine = s.line;
      switch (s.k) {
        case "expr": ev(s.e, env); break;
        case "assign": { const v = ev(s.value, env); s.targets.forEach((t) => assignTo(t, v, env)); break; }
        case "aug": {
          const cur = ev(s.target, env);
          const val = ev(s.value, env);
          if (s.op === "+" && Array.isArray(cur) && !cur.__tuple) { cur.push(...iterate(val)); break; }
          assignTo(s.target, binop(s.op, cur, val), env);
          break;
        }
        case "if": {
          for (const [c, b] of s.branches) if (truthy(ev(c, env))) { execBlock(b, env); return; }
          if (s.orelse) execBlock(s.orelse, env);
          break;
        }
        case "while": {
          let broke = false;
          while (truthy(ev(s.cond, env))) {
            tick();
            if (loopBody(s.body, env) === "break") { broke = true; break; }
            curLine = s.line;
          }
          if (!broke && s.orelse) execBlock(s.orelse, env);
          break;
        }
        case "for": {
          let broke = false;
          for (const item of iterate(ev(s.iter, env))) {
            tick();
            assignTo(s.target, item, env);
            if (loopBody(s.body, env) === "break") { broke = true; break; }
          }
          if (!broke && s.orelse) execBlock(s.orelse, env);
          break;
        }
        case "def":
          setVar(s.name, { __pyfunc: true, name: s.name, params: s.params.map((p) => ({ name: p.name, def: p.def ? ev(p.def, env) : undefined })), body: s.body }, env);
          break;
        case "return": throw new ReturnSignal(s.e ? ev(s.e, env) : null);
        case "break": throw BREAK;
        case "continue": throw CONTINUE;
        case "pass": break;
        case "import":
          s.names.forEach((n) => { if (n === "as") return; if (!MODULES[n]) throw E("ModuleNotFoundError", `No module named '${n}'`); setVar(n, MODULES[n], env); });
          break;
        case "from": {
          const mod = MODULES[s.mod];
          if (!mod) throw E("ModuleNotFoundError", `No module named '${s.mod}'`);
          s.names.forEach((n) => { if (!(n in mod)) throw E("ImportError", `cannot import name '${n}' from '${s.mod}'`); setVar(n, mod[n], env); });
          break;
        }
        case "global": s.names.forEach((n) => env.globalDecl.add(n)); break;
        case "del": {
          const t = s.target;
          if (t.k === "name") env.vars.delete(t.v);
          else if (t.k === "index") {
            const o = ev(t.obj, env), i = ev(t.idx, env);
            if (Array.isArray(o)) o.splice(idxOf(o, i), 1);
            else if (o instanceof Map) { if (!o.has(normKey(i))) throw E("KeyError", pyRepr(i)); o.delete(normKey(i)); }
          }
          break;
        }
        case "try": {
          let failed = false;
          try { execBlock(s.body, env); }
          catch (x) {
            if (!(x instanceof PyError) || x.pyType === "TimeoutError" || x.pyType === "OutputError") throw x;
            const h = s.handlers.find((hh) => !hh.type || hh.type === x.pyType || hh.type === "Exception");
            if (!h) throw x;
            failed = true;
            if (h.as) setVar(h.as, x.message, env);
            execBlock(h.body, env);
          } finally { if (s.final) execBlock(s.final, env); }
          if (!failed && s.orelse) execBlock(s.orelse, env);
          break;
        }
      }
    }

    try {
      const prog = parseProgram(code);
      execBlock(prog, globals);
      return { output: out.join(""), error: null };
    } catch (x) {
      if (x instanceof PyError) return { output: out.join(""), error: { type: x.pyType, msg: x.message, line: x.line || curLine } };
      if (x === BREAK || x === CONTINUE) return { output: out.join(""), error: { type: "SyntaxError", msg: "'break' / 'continue' outside loop", line: curLine } };
      if (x instanceof ReturnSignal) return { output: out.join(""), error: { type: "SyntaxError", msg: "'return' outside function", line: curLine } };
      if (x instanceof RangeError) return { output: out.join(""), error: { type: "RecursionError", msg: "maximum recursion depth exceeded", line: curLine } };
      return { output: out.join(""), error: { type: "InternalError", msg: String(x && x.message ? x.message : x), line: curLine } };
    }
  }

  return { run };
})();

/* ======================= PYODIDE (WEB WORKER) ======================= */
const PyRunner = (() => {
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  let worker = null;
  let status = "idle"; // idle | loading | ready | failed
  let msgId = 0;
  const pending = new Map();
  const listeners = new Set();

  const workerSrc = `
    let py = null;
    const SETUP = [
      "import sys, io, builtins",
      "__pq_out = io.StringIO()",
      "sys.stdout = __pq_out",
      "sys.stderr = __pq_out",
      "__pq_in = list(__pq_inputs)",
      "def __pq_input(prompt=''):",
      "    __pq_out.write(str(prompt))",
      "    v = __pq_in.pop(0) if __pq_in else ''",
      "    __pq_out.write(v + '\\\\n')",
      "    return v",
      "builtins.input = __pq_input",
    ].join("\\n");
    const ready = (async () => {
      importScripts("${PYODIDE_URL}pyodide.js");
      py = await loadPyodide({ indexURL: "${PYODIDE_URL}" });
    })();
    ready.then(() => postMessage({ type: "ready" })).catch((e) => postMessage({ type: "loadError", error: String(e) }));
    onmessage = async (e) => {
      const { id, code, inputs } = e.data;
      try {
        await ready;
        const ns = py.globals.get("dict")();
        ns.set("__pq_inputs", py.toPy(inputs || []));
        py.runPython(SETUP, { globals: ns });
        let error = null;
        try {
          if (/^\\s*(import|from)\\s/m.test(code)) { try { await py.loadPackagesFromImports(code); } catch (_) {} }
          py.runPython(code, { globals: ns });
        } catch (err) { error = String(err && err.message ? err.message : err); }
        const output = py.runPython("__pq_out.getvalue()", { globals: ns });
        py.runPython("import sys\\nsys.stdout = sys.__stdout__\\nsys.stderr = sys.__stderr__", { globals: ns });
        ns.destroy();
        postMessage({ type: "result", id, output, error });
      } catch (err) {
        postMessage({ type: "result", id, fatal: String(err) });
      }
    };
  `;

  function setStatus(s) {
    status = s;
    listeners.forEach((fn) => { try { fn(s); } catch (e) { /* ignore */ } });
  }

  function init() {
    if (worker || status === "failed") return;
    try {
      const blob = new Blob([workerSrc], { type: "application/javascript" });
      worker = new Worker(URL.createObjectURL(blob));
      setStatus("loading");
      worker.onmessage = (e) => {
        const d = e.data;
        if (d.type === "ready") setStatus("ready");
        else if (d.type === "loadError") { setStatus("failed"); killWorker(); }
        else if (d.type === "result") {
          const p = pending.get(d.id);
          if (p) { pending.delete(d.id); clearTimeout(p.timer); p.resolve(d); }
        }
      };
      worker.onerror = () => { setStatus("failed"); killWorker(); };
      // jika terlalu lama memuat (koneksi lambat), tetap gunakan Mini Python
      setTimeout(() => { if (status === "loading") { /* tetap tunggu, Mini Python dipakai sementara */ } }, 60000);
    } catch (e) {
      setStatus("failed");
    }
  }

  function killWorker() {
    if (worker) { try { worker.terminate(); } catch (e) { /* ignore */ } }
    worker = null;
    pending.forEach((p) => p.resolve({ fatal: "terminated" }));
    pending.clear();
  }

  function parsePyodideError(msg) {
    const lines = String(msg).split("\n").map((l) => l.trimEnd()).filter(Boolean);
    let lineNo = null;
    lines.forEach((l) => { const m = /File "<exec>", line (\d+)/.exec(l); if (m) lineNo = +m[1]; });
    const last = lines[lines.length - 1] || "Error";
    const m = /^(\w+):\s?(.*)$/.exec(last);
    return m ? { type: m[1], msg: m[2], line: lineNo } : { type: "Error", msg: last, line: lineNo };
  }

  function runPyodide(code, inputs) {
    return new Promise((resolve) => {
      const id = ++msgId;
      const timer = setTimeout(() => {
        pending.delete(id);
        killWorker();
        setStatus("idle");
        init(); // muat ulang worker di background
        resolve({ timeout: true });
      }, 8000);
      pending.set(id, { resolve, timer });
      worker.postMessage({ id, code, inputs });
    });
  }

  async function run(code, inputs) {
    inputs = inputs || [];
    if (status === "ready" && worker) {
      const r = await runPyodide(code, inputs);
      if (r.timeout) return { output: "", error: { type: "TimeoutError", msg: "Program berjalan terlalu lama. Mungkin ada loop yang tidak pernah berhenti?", line: null }, engine: "pyodide" };
      if (!r.fatal) return { output: r.output || "", error: r.error ? parsePyodideError(r.error) : null, engine: "pyodide" };
    }
    const res = MiniPy.run(code, inputs);
    return Object.assign(res, { engine: "mini" });
  }

  return {
    init,
    run,
    getStatus: () => status,
    onStatus: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();

/* ======================= PENJELASAN ERROR (BAHASA MANUSIA) ======================= */
function explainError(err) {
  if (!err) return null;
  const line = err.line ? ` (baris ${err.line})` : "";
  const nameMatch = /name '(.+?)' is not defined/.exec(err.msg || "");
  const map = {
    NameError: nameMatch
      ? `Python tidak kenal nama <code>${escapeHtml(nameMatch[1])}</code>${line}. Mungkin ada typo, atau kotak (variable) itu belum dibuat. Kalau maksudnya tulisan biasa, jangan lupa pakai tanda kutip "...".`
      : `Ada nama yang tidak dikenal Python${line}. Cek ejaan namanya ya.`,
    SyntaxError: `Ada penulisan yang tidak sesuai aturan Python${line}. Cek lagi: tanda kutip sudah berpasangan? Kurung ( ) sudah ditutup? Ada titik dua <code>:</code> setelah if/for/while/def?`,
    IndentationError: `Masalah spasi di depan baris${line}. Python memakai spasi (indentasi) untuk tahu baris mana yang "di dalam" if/for/def. Biasanya pakai 4 spasi.`,
    TypeError: `Kamu mencampur jenis data yang tidak cocok${line}. Contoh: menjumlahkan tulisan "5" dengan angka 5. Coba ubah dulu pakai <code>int()</code> atau <code>str()</code>.`,
    ValueError: `Nilainya tidak bisa diproses${line}. Contoh: <code>int("abc")</code> — "abc" bukan angka, jadi tidak bisa diubah menjadi angka.`,
    IndexError: `Kamu mengambil urutan yang tidak ada${line}. Ingat: urutan (index) di Python dimulai dari 0, dan index terakhir = panjang - 1.`,
    KeyError: `Kunci itu tidak ada di dalam dictionary${line}. Cek lagi ejaan kuncinya.`,
    ZeroDivisionError: `Kamu membagi dengan nol${line}. Di matematika maupun di Python, itu tidak boleh 😅`,
    AttributeError: `Data ini tidak punya kemampuan (method) tersebut${line}. Cek ejaan atau jenis datanya.`,
    TimeoutError: `Program tidak berhenti-berhenti. Biasanya karena loop <code>while</code> yang kondisinya selalu True. Pastikan ada sesuatu yang berubah di dalam loop.`,
    NotSupported: escapeHtml(err.msg),
    ModuleNotFoundError: `Modul itu tidak ditemukan${line}. Cek ejaan nama modulnya.`,
    RecursionError: `Function memanggil dirinya sendiri terus-menerus tanpa berhenti.`,
  };
  return {
    title: `${err.type}${err.msg ? ": " + err.msg : ""}`,
    text: map[err.type] || `Ada error${line}. Baca pesan errornya pelan-pelan dari baris paling bawah, biasanya di situ letak petunjuknya.`,
  };
}

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
