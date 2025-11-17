class StringUtils {

    static persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    static arabicDigits  = "٠١٢٣٤٥٦٧٨٩";

    // تبدیل اعداد فارسی + عربی → انگلیسی
    static convertToEnglishDigits(text) {
        if (!text) return "";

        return text
            .replace(/[۰-۹]/g, d => this.persianDigits.indexOf(d))
            .replace(/[٠-٩]/g, d => this.arabicDigits.indexOf(d));
    }

    // تبدیل اعداد انگلیسی → فارسی
    static convertToPersianDigits(text) {
        if (!text) return "";

        return text.replace(/\d/g, d => this.persianDigits[d]);
    }

    // اصلاح حروف عربی → فارسی
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

    // نرمال کامل متن فارسی (ترکیبی)
    static normalizeText(text) {
        if (!text) return "";
        const fixedNumbers = this.convertToEnglishDigits(text);
        return this.normalizeArabicCharacters(fixedNumbers).trim();
    }

    // فقط تبدیل عدد به فارسی (بدون نرمال متن)
    static convertNumberOnly(text) {
        return this.convertToPersianDigits(String(text));
    }
}

module.exports = StringUtils;
