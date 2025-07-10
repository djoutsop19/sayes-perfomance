import React from "react";
import { Card, Button, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  DollarCircleOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import logo from "../assets/sayes-performance-logo.jpg";

const packageData = [
  {
    title: "Demo Package",
    price: "$99",
    icon: <ThunderboltOutlined className="text-[#ffdd57]" />,
    description: "Access to group training and performance dashboard.",
  },
  {
    title: "New Package",
    price: "$100",
    icon: <RocketOutlined className="text-[#4ef5ff]" />,
    description: "Includes performance analytics and personalized sessions.",
  },
  {
    title: "Elite Package",
    price: "$199",
    icon: <RocketOutlined className="text-[#ff416c]" />,
    description: "Full access with one-on-one coaching and detailed tracking.",
  },
  {
    title: "Starter Package",
    price: "$49",
    icon: <ThunderboltOutlined className="text-[#52c41a]" />,
    description: "Perfect for beginners with weekly group training.",
  },
  {
    title: "Team Package",
    price: "$299",
    icon: <TeamOutlined className="text-[#facc15]" />,
    description: "Best for teams – analytics, training & match reviews.",
  },
  {
    title: "Pro Package",
    price: "$149",
    icon: <RocketOutlined className="text-[#a78bfa]" />,
    description: "Advanced performance tracking & private coach sessions.",
  },
];

const PackagesPage = ({ packageData: selectedPackage, isModal = false, lightMode = false }) => {
  const packagesToDisplay = selectedPackage ? [selectedPackage] : packageData;

  return (
    <div
      className={`w-full font-sans px-1 sm:px-6 py-4 ${
        lightMode
          ? "bg-white text-gray-900"
          : "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white"
      }`}
    >
      {/* Header (hidden in modal) */}
      {!isModal && (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-2">
          <a
            href="/LandingPage"
            className={`text-sm sm:text-base flex items-center gap-2 ${
              lightMode ? "text-gray-900 hover:text-[#4ef5ff]" : "text-white hover:text-[#4ef5ff]"
            } order-2 sm:order-1`}
          >
            <ArrowLeftOutlined /> Back
          </a>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <img src={logo} alt="Sayes Logo" className="h-8 sm:h-10 rounded-full shadow-md" />
            <h1 className="text-lg sm:text-xl font-extrabold tracking-wide">Our Packages</h1>
          </div>
          <div className="hidden sm:block w-20 order-3" />
        </div>
      )}

      {/* Packages Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-full ${isModal ? 'mx-auto max-w-[300px]' : ''}`}>
        {packagesToDisplay.map((pack, index) => (
          <Card
            key={index}
            title={
              <span className="text-sm sm:text-lg font-semibold flex items-center gap-2">
                {pack.icon} {pack.title}
              </span>
            }
            bordered={false}
            className={`rounded-xl shadow-lg transition duration-300 ${
              lightMode ? "bg-gray-100" : "bg-[#1f1d3a]"
            } p-2 sm:p-6 ${isModal ? '' : 'hover:-translate-y-1 hover:scale-[1.02]'}`}
            extra={
              <span className="text-sm sm:text-lg font-bold text-[#4ef5ff] flex items-center gap-1">
                <DollarCircleOutlined /> {pack.price}
              </span>
            }
          >
            <p className="text-sm sm:text-base mb-2 sm:mb-3 line-height-1.7">
              {pack.description}
            </p>
            <div className="flex flex-row flex-wrap justify-center gap-2 sm:gap-3">
              <Tooltip title="View the full benefits of this plan">
                <Button
                  className={`${
                    lightMode
                      ? "bg-gray-200 text-gray-900 hover:bg-[#4ef5ff] hover:text-black"
                      : "bg-[#4ef5ff] text-black hover:bg-white hover:text-black"
                  } font-medium transition-all rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-sm h-10 sm:h-auto min-w-[120px]`}
                  icon={<InfoCircleOutlined />}
                >
                  View Details
                </Button>
              </Tooltip>
              <Tooltip title="Contact us to get personalized guidance">
                <Button
                  className={`${
                    lightMode
                      ? "bg-gray-200 text-gray-900 hover:bg-[#ff416c] hover:text-white"
                      : "bg-[#ff416c] text-white hover:bg-white hover:text-black"
                  } font-medium transition-all rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-sm h-10 sm:h-auto min-w-[120px]`}
                  icon={<InfoCircleOutlined />}
                >
                  Get Info
                </Button>
              </Tooltip>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer (hidden in modal) */}
      {!isModal && (
        <footer className={`text-center text-xs sm:text-sm mt-6 sm:mt-8 pt-3 border-t ${
          lightMode ? "border-gray-300 text-gray-600" : "border-gray-700 text-gray-400"
        }`}>
          <img src={logo} alt="Logo" className="h-8 sm:h-10 mx-auto mb-2 rounded-full" />
          <p>© {new Date().getFullYear()} Sayes Performance. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
};

export default PackagesPage;