const Tour = require("../models/tourModel");
const factory = require("./handlerFactory");

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,duration,difficulty,ratingsAverage,summary";
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { avgPrice: 1 } },
      {
        $match: { _id: { $ne: "EASY" } },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTours: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTours: -1 },
      },
      { $limit: 6 },
    ]);
    res.status(200).json({
      status: "success",
      data: { plan },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};