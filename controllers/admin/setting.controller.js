const SettingGeneral = require('../../models/setting-general.model')

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
    // lay ban ghi dau tien trong bang data
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    });
};


// [PATCH] /admin/settings/general
module.exports.patchGeneral = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    if (settingGeneral) {
        await settingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body);
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }
    
    res.redirect("back");
};