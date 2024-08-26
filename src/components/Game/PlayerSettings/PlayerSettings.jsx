import React from "react";
import styles from "./PlayerSettings.module.css";

const PlayerSettings = ({ title, playerSettingsRef }) => {
  return (
    <div className={styles.playerSettings} ref={playerSettingsRef}>
      <h3>{title}</h3>
      <p>Скорость движения</p>
      <input type="range" min={0} max={100}/>

      <p>Частота выстрела</p>
      <input type="range" min={0} max={100}/>
    </div>
  );
};

export default PlayerSettings;
