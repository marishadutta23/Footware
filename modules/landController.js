import Landing from "./landModel.js";

export const getLandingPage = async (req, res) => {
  try {
    const landing = await Landing.findOne();
    res.status(200).json(landing);
  } catch (err) {
    res.status(500).json({ message: "Landing fetch failed" });
  }
};
