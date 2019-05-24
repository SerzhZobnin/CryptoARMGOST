import React from "react";

interface ILicenseInfoField {
  title: string;
  info: string;
  style: any;
}

export default function LicenseInfoField({ title, info, style }: ILicenseInfoField) {
    return (
      <React.Fragment>
        <div className="desktoplic_text_item bottomitem">{title}</div>
        <div className="desktoplic_text_item" style={style}>{info}</div>
      </React.Fragment>
    );
}
