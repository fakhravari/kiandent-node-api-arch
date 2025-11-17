const DateTimeUtils = require("../utils/DateTimeUtils");
const StringUtils = require("../utils/StringUtils");
const asyncHandler = require('../utils/asyncHandler');


exports.dateformat = asyncHandler(async (req, res) => {

    const now = new Date();

    // مثال 1: تاریخ شمسی
    const shamsiDate = DateTimeUtils.toShamsi(now);

    // مثال 2: تاریخ شمسی با ساعت
    const shamsiTime = DateTimeUtils.toShamsiTime(now);

    // مثال 3: شمسی به میلادی
    const miladi = DateTimeUtils.toMiladi("1402/07/20 15:23:10");

    // مثال 4: اختلاف دو تاریخ (بر حسب ثانیه)
    const diffSec = DateTimeUtils.diffSeconds(
        new Date("2024-01-10T10:00:00"),
        new Date("2024-01-10T10:05:30")
    );

    // مثال 5: افزودن دقیقه
    const added = DateTimeUtils.addMinutes(now, 45);

    // مثال 6: افزودن روز
    const nextWeek = DateTimeUtils.addDays(now, 7);

    res.json({
        success: true,
        examples: {
            now,
            shamsiDate,
            shamsiTime,
            miladi,
            diff_in_seconds: diffSec,
            add_45_minutes: added,
            next_week: nextWeek
        }
    });
});


exports.stringFormat = asyncHandler(async (req, res) => {

    res.json({
        success: true,
        examples: {
            persian_digits_to_english: 
                StringUtils.convertToEnglishDigits("۱۲۳۴۵۶"),

            arabic_digits_to_english: 
                StringUtils.convertToEnglishDigits("٤٥٦٧٨"),

            english_digits_to_persian: 
                StringUtils.convertToPersianDigits("123456"),

            fix_arabic_characters: 
                StringUtils.normalizeArabicCharacters("علي رضا و كتاب"),

            normalize_full_text: 
                StringUtils.normalizeText("۱۲۳ علي ٤٥٦ كتاب"),

            convert_numbers_only: 
                StringUtils.convertNumberOnly("98765"),
        }
    });
});