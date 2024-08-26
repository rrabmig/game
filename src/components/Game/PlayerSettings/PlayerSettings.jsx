import React from "react";
import styles from "./PlayerSettings.module.css";

const PlayerSettings = ({ title, playerSettingsRef }) => {
  return (
    <div className={styles.playerSettings} ref={playerSettingsRef}>
      <h3>{title}</h3>
      <p>Скорость движения</p>
      <input type="range" placeholder="30"/>

      <p>Частота выстрела</p>
      <input type="range" placeholder="0.5"/>
    </div>
  );
};

export default PlayerSettings;
