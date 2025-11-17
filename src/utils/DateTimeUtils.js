const jalaali = require("jalaali-js");

class DateTimeUtils {

    // --- میلادی → شمسی ---
    static toShamsi(date) {
        if (!(date instanceof Date)) date = new Date(date);

        const j = jalaali.toJalaali(date);
        const y = j.jy.toString().padStart(4, "0");
        const m = j.jm.toString().padStart(2, "0");
        const d = j.jd.toString().padStart(2, "0");

        return `${y}/${m}/${d}`;
    }

    // --- میلادی → شمسی + ساعت ---
    static toShamsiTime(date) {
        if (!(date instanceof Date)) date = new Date(date);

        const j = jalaali.toJalaali(date);

        const y = j.jy.toString().padStart(4, "0");
        const m = j.jm.toString().padStart(2, "0");
        const d = j.jd.toString().padStart(2, "0");

        const hh = date.getHours().toString().padStart(2, "0");
        const mm = date.getMinutes().toString().padStart(2, "0");
        const ss = date.getSeconds().toString().padStart(2, "0");

        return `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
    }

    // --- شمسی → میلادی ---
    static toMiladi(shamsi) {
        const [datePart, timePart = "00:00:00"] = shamsi.split(" ");

        const [jy, jm, jd] = datePart.split("/").map(Number);
        const [hh, mm, ss] = timePart.split(":").map(Number);

        const g = jalaali.toGregorian(jy, jm, jd);
        return new Date(g.gy, g.gm - 1, g.gd, hh, mm, ss);
    }

    // --- اختلاف دو تاریخ بر حسب ثانیه ---
    static diffSeconds(date1, date2) {
        const d1 = date1 instanceof Date ? date1 : new Date(date1);
        const d2 = date2 instanceof Date ? date2 : new Date(date2);

        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
            throw new Error("Invalid date passed to diffSeconds");
        }

        return Math.floor((d2 - d1) / 1000);
    }

    // --- افزودن دقیقه ---
    static addMinutes(date, mins) {
        const d = date instanceof Date ? date : new Date(date);
        return new Date(d.getTime() + mins * 60 * 1000);
    }

    // --- افزودن روز ---
    static addDays(date, days) {
        const d = date instanceof Date ? date : new Date(date);
        return new Date(d.getTime() + days * 86400 * 1000);
    }
}

module.exports = DateTimeUtils;
