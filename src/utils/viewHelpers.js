function formatDateToYMD(dt) {
  try {
    if (!dt) return "";
    const d = new Date(dt);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}/${m}/${day}`;
  } catch (e) {
    return String(dt);
  }
}

function escapeSingleQuotes(s) {
  if (s === null || s === undefined) return s;
  return String(s).replace(/'/g, "''");
}

function formatDateTimeSQL(val) {
  try {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);

    const Y = d.getFullYear();
    const M = String(d.getMonth() + 1).padStart(2, "0");
    const D = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");

    return `${Y}-${M}-${D} ${hh}:${mm}:${ss}`;
  } catch (e) {
    return String(val);
  }
}

if (typeof Date.prototype.formatDateTimeSQL !== "function") {
  Object.defineProperty(Date.prototype, "formatDateTimeSQL", {
    value: function () {
      try {
        const d = this instanceof Date ? this : new Date(this);
        if (isNaN(d.getTime())) return String(this);

        const Y = d.getFullYear();
        const M = String(d.getMonth() + 1).padStart(2, "0");
        const D = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        const ss = String(d.getSeconds()).padStart(2, "0");

        return `${Y}-${M}-${D} ${hh}:${mm}:${ss}`;
      } catch (e) {
        return String(this);
      }
    },
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

module.exports = { formatDateToYMD, escapeSingleQuotes, formatDateTimeSQL };
