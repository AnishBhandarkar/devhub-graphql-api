const DataLoader = require("dataloader");
const Developer = require("../developer/developer.model");

const developerLoader = new DataLoader(async (developerIds) => {

    const developers = await Developer.find({
        _id: { $in: developerIds }
    }).select("-password");

    const developerMap = {};

    developers.forEach(dev => {
        developerMap[dev._id.toString()] = dev;
    });

    return developerIds.map(id =>
        developerMap[id.toString()]
    );

});

module.exports = developerLoader;