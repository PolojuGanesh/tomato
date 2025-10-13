import { assets } from "../../assets/frontend_assets/assets";

import "./index.css";

const Footer = () => {
  return (
    <div className="footer-main-container" id="contact-us">
      <div className="footer-sub-content">
        <div className="footer-left-content">
          <img src={assets.logo} alt="" className="footer-logo" />
          <h3 className="footer-para">Follow us</h3>
          <div className="footer-social-icons-container">
            <img
              className="footer-social-icons"
              src={assets.linkedin_icon}
              alt=""
            />
            <img
              className="footer-social-icons"
              src={assets.facebook_icon}
              alt=""
            />
            <img
              className="footer-social-icons"
              src={assets.twitter_icon}
              alt=""
            />
          </div>
        </div>
        <div className="footer-center-content">
          <h2 className="company-heading">COMPANY</h2>
          <ul className="ul-center-footer">
            <li className="each-footer-list">Home</li>
            <li className="each-footer-list">About us</li>
            <li className="each-footer-list">Delivery</li>
            <li className="each-footer-list">Privacy policy</li>
          </ul>
        </div>
        <div className="footer-right-content">
          <h2 className="get-in-touch-footer-heading">GET IN TOUCH</h2>
          <ul className="ul-right-container">
            <li className="each-right-footer-list">+1-0000-9999-7777</li>
            <li className="each-right-footer-list">contact@tomato.com</li>
          </ul>
        </div>
      </div>
      <hr className="break-line" />
      <p className="copy-right-para">
        Copyright 2025 © Tomato.com All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
