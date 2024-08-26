import React, { useEffect, useRef, useState } from "react";
import styles from "./Game.module.css";
import PlayerSettings from "./PlayerSettings/PlayerSettings.jsx";
import GameCanvas from "./GameCanvas/GameCanvas.jsx";
import Scene from "../../scripts/classes.js";

const Game = () => {
  const canvasRef = useRef(null);
  const player1SettingsRef = useRef(null);
  const player2SettingsRef = useRef(null);
  const startButtonRef = useRef(null);
  const scorebarRef = useRef(null);
  const mouseModeChangerRef = useRef(null);
  const scene = useRef(null);
  const colorPickerRef = useRef(null);

  const [mode, setMode] = useState("cursor");

  const animate = () => {
    scene.current.render();
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    scene.current = new Scene(
      canvasRef,
      player1SettingsRef,
      player2SettingsRef,
      startButtonRef,
      scorebarRef,
      mouseModeChangerRef,
      colorPickerRef
    );
    animate();
  }, []);

  return (
    <div>
      <h1 className={styles.title}>Дуэль</h1>
      <div className={styles.wrapper}>
        <div className={styles.settings}>
          <PlayerSettings
            title="Игрок 1"
            playerSettingsRef={player1SettingsRef}
          />
          <PlayerSettings
            title="Игрок 2"
            playerSettingsRef={player2SettingsRef}
          />
          <div ref={mouseModeChangerRef}>
            <button
              className={[
                styles.modeButton,
                mode === "cursor" ? styles.selected : "",
              ].join(" ")}
              onClick={() => setMode("cursor")}
            >
              <img
                src="https://avatars.mds.yandex.net/i?id=911ac54245588530896f3048dd1c5c4a_sr-5345995-images-thumbs&n=13"
                style={{ width: "30px", height: "30px" }}
                alt="кликать по шарикам"
              />
            </button>
            <button
              className={[
                styles.modeButton,
                mode === "ball" ? styles.selected : "",
              ].join(" ")}
              onClick={() => setMode("ball")}
            >
              <img
                src="https://0.academia-photos.com/79762227/72146693/60605576/s200_zolfa.imani.jpg"
                style={{ width: "30px", height: "30px" }}
                alt="отбивать шарики"
              />
            </button>
          </div>
        </div>
        <div className={styles.screen}>
          <div className={styles.scorebar} ref={scorebarRef}>
            <p>7</p>
            <p>8</p>
          </div>
          <GameCanvas canvasRef={canvasRef} />
        </div>
        <div className={styles.colorPicker} ref={colorPickerRef}> 
        </div>
      </div>
      <button className={styles.startButton}> Начать </button>
    </div>
  );
};

export default Game;
