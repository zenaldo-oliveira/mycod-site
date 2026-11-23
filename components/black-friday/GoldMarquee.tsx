import styles from "./black-friday.module.css";

// Faixa dourada horizontal entre seções, com o mesmo marquee das fitas, sem
// inclinação. Decorativa (aria-hidden): o texto principal já está no h1 e nas seções.
const TEXT = "BLACK FRIDAY MYCOD • SITES • SISTEMAS • AUTOMAÇÕES •";
const REPEATS = 4;

function Segment() {
  return (
    <div className={styles.segment}>
      {Array.from({ length: REPEATS }, (_, index) => (
        <span key={index} className={styles.item}>
          {TEXT}
        </span>
      ))}
    </div>
  );
}

export function GoldMarquee() {
  return (
    <div className={styles.goldMarquee} aria-hidden="true">
      <div className={`${styles.track} ${styles.trackLeft}`}>
        <Segment />
        <Segment />
      </div>
    </div>
  );
}
