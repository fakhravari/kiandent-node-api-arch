const {
    StringUtils,
    DateUtils,
    HumanDateUtils,
    IranValidators,
    SlugUtils
} = require("../utils/PersianUtils");
const asyncHandler = require('../utils/asyncHandler');




exports.fullFormat = asyncHandler(async (req, res) => {

    res.json({
        success: true,
        examples: {

            _persian_digits: {
                before: "۱۲۳۴۵۶",
                after: StringUtils.ToEnglishDigits("۱۲۳۴۵۶")
            },

            normalize_text: {
                before: "۱۲۳ علي ٤٥٦ كتاب",
                after: StringUtils.normalizeText("۱۲۳ علي ٤٥٦ كتاب")
            },

            shamsi_date: {
                before: "2024-01-15",
                after: DateUtils.toShamsi("2024-01-15")
            },

            miladi_date: {
                before: "1402/10/20 15:20:30",
                after: DateUtils.toMiladi("1402/10/20 15:20:30")
            },

            diff_seconds: {
                before: ["2024-01-01", "2024-01-01 00:01:30"],
                after: DateUtils.diffSeconds("2024-01-01", "2024-01-01T00:01:30")
            },

            mobile_validation: {
                before: "09123456789",
                after: IranValidators.isValidMobile("09123456789")
            },

            nationalcode_validation: {
                before: "0013520849",
                after: IranValidators.isValidNationalCode("0013520849")
            },

            human_time: {
                before: "2024-01-15T10:00:00",
                after: HumanDateUtils.humanize("2024-01-15T10:00:00")
            },

            slugify: {
                before: "Component Stimulsoft Reports 2025/15 ver 9.5",
                after: SlugUtils.slugify("Component Stimulsoft Reports 2025/15 ver 9.5")
            }
        }
    });
});