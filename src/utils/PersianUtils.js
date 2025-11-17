const jalaali = require("jalaali-js");

//
// ======================================
//   StringUtils
// ======================================
class StringUtils {

    static persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    static arabicDigits = "٠١٢٣٤٥٦٧٨٩";

    static ToEnglishDigits(text) {
        if (!text) return "";
        return text
            .replace(/[۰-۹]/g, d => this.persianDigits.indexOf(d))
            .replace(/[٠-٩]/g, d => this.arabicDigits.indexOf(d));
    }

    static ToPersianDigits(text) {
        if (!text) return "";
        return text.replace(/\d/g, d => this.persianDigits[d]);
    }

    static normalizeArabicCharacters(text) {
        if (!text) return "";
        return text
            .replace(/ي/g, "ی")
            .replace(/ئ/g, "ی")
            .replace(/ك/g, "ک")
            .replace(/ؤ/g, "و")
            .replace(/ة/g, "ه")
            .replace(/ۀ/g, "ه")
            .replace(/[أإٱ]/g, "ا");
    }

    static normalizeText(text) {
        if (!text) return "";
        const en = this.ToEnglishDigits(text);
        return this.normalizeArabicCharacters(en).trim();
    }
}


//
// ======================================
//   DateUtils
// ======================================
class DateUtils {

    static toShamsi(date) {
        const d = new Date(date);
        const j = jalaali.toJalaali(d);
        return `${j.jy}/${j.jm.toString().padStart(2, "0")}/${j.jd.toString().padStart(2, "0")}`;
    }

    static toShamsiTime(date) {
        const d = new Date(date);
        const j = jalaali.toJalaali(d);

        return `${j.jy}/${j.jm.toString().padStart(2, "0")}/${j.jd.toString().padStart(2, "0")} ` +
            `${d.getHours().toString().padStart(2, "0")}:` +
            `${d.getMinutes().toString().padStart(2, "0")}:` +
            `${d.getSeconds().toString().padStart(2, "0")}`;
    }

    static toMiladi(shamsi) {
        const [datePart, timePart = "00:00:00"] = shamsi.split(" ");
        const [jy, jm, jd] = datePart.split("/").map(Number);
        const [hh, mm, ss] = timePart.split(":").map(Number);

        const g = jalaali.toGregorian(jy, jm, jd);
        return new Date(g.gy, g.gm - 1, g.gd, hh, mm, ss);
    }

    static diffSeconds(d1, d2) {
        return Math.floor((new Date(d2) - new Date(d1)) / 1000);
    }

    static addMinutes(date, mins) {
        return new Date(new Date(date).getTime() + mins * 60000);
    }

    static addDays(date, days) {
        return new Date(new Date(date).getTime() + days * 86400000);
    }
}


//
// ======================================
//   HumanDateUtils
// ======================================
class HumanDateUtils {
    static humanize(date) {
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);

        if (diff < 60) return `${diff} ثانیه پیش`;
        if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
        if (diff < 172800) return "دیروز";

        return `${Math.floor(diff / 86400)} روز پیش`;
    }
}


//
// ======================================
//   IranValidators
// ======================================
class IranValidators {

    static isValidMobile(mobile) {
        return /^09\d{9}$/.test(mobile);
    }

    static isValidNationalCode(code) {
        if (!/^\d{10}$/.test(code)) return false;

        const check = +code[9];
        const sum = code.split("").slice(0, 9).reduce((a, x, i) => a + (+x * (10 - i)), 0) % 11;

        return (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
    }

    static isValidCardNumber(card) {
        if (!/^\d{16}$/.test(card)) return false;

        let sum = 0;
        for (let i = 0; i < 16; i++) {
            let n = +card[i];
            if (i % 2 === 0) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
        }
        return sum % 10 === 0;
    }
}


//
// ======================================
//   SlugUtils
// ======================================
class SlugUtils {

    static slugify(text) {
        if (!text) return "";

        // 1) نرمال‌سازی کامل متن
        let normalized = StringUtils.normalizeText(text);

        // 2) حذف علائم نگارشی و کاراکترهای اضافی
        normalized = normalized
            .replace(/[.,/#!$%^&*;:{}=\-_`~()؟!“”"«»…]/g, " ")
            .replace(/\s+/g, " ");

        // 3) حذف هر چیزی غیر از حروف فارسی، انگلیسی و عدد
        normalized = normalized.replace(/[^a-zA-Z0-9آ-ی ]/g, "");

        // 4) جایگزینی فاصله‌ها با خط فاصله
        normalized = normalized.trim().replace(/\s+/g, "-");

        // 5) جلوگیری از خط فاصله تکراری
        normalized = normalized.replace(/-+/g, "-");

        return normalized.toLowerCase();
    }
}

module.exports = {
    StringUtils,
    DateUtils,
    HumanDateUtils,
    IranValidators,
    SlugUtils
};
