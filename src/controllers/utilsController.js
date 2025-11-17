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

    const ex1_before = "۱۲۳۴۵۶";
    const ex2_before = "٤٥٦٧٨";
    const ex3_before = "123456";
    const ex4_before = "علي رضا و كتاب";
    const ex5_before = "۱۲۳ علي ٤٥٦ كتاب";
    const ex6_before = "98765";

    res.json({
        success: true,
        examples: {

            persian_digits_to_english: {
                before: ex1_before,
                after: StringUtils.convertToEnglishDigits(ex1_before)
            },

            arabic_digits_to_english: {
                before: ex2_before,
                after: StringUtils.convertToEnglishDigits(ex2_before)
            },

            english_digits_to_persian: {
                before: ex3_before,
                after: StringUtils.convertToPersianDigits(ex3_before)
            },

            fix_arabic_characters: {
                before: ex4_before,
                after: StringUtils.normalizeArabicCharacters(ex4_before)
            },

            normalize_full_text: {
                before: ex5_before,
                after: StringUtils.normalizeText(ex5_before)
            },

            convert_numbers_only: {
                before: ex6_before,
                after: StringUtils.convertNumberOnly(ex6_before)
            }
        }
    });
});
