import Banner from "@/components/homePage/Banner";

import FeatureSection from "@/components/homePage/FeatureSection";
import ProgramSection from "@/components/homePage/ProgramSection";
import React from "react";

const HomePage = () => {
  return <div className="content-wrapper space-y-16">
    <Banner />
    <FeatureSection />
    <ProgramSection />
  </div>;
};

export default HomePage;
