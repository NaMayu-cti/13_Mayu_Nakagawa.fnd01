window.addEventListener("DOMContentLoaded", () => {
  // 日付をセット
  const dateBox = document.getElementById("date-box");
  if (dateBox) {
    const now = new Date();
    dateBox.innerText = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;
  }

  // イベントのセットアップ（重複宣言を避けるため一度だけ）
  const map = document.querySelector(".map-container");
  if (!map) return;

  // ポップアップ要素は動的に作る（1つだけ）
  let popup = null;
  function createPopup() {
    if (popup) return popup;
    popup = document.createElement("div");
    popup.className = "popup";
    map.appendChild(popup);
    // クリックで閉じる（ポップアップ自身をクリックしても閉じないよう stop）
    popup.addEventListener("click", (ev) => ev.stopPropagation());
    return popup;
  }

  // クリックで表示
  const bears = Array.from(document.querySelectorAll(".bear"));
  bears.forEach(bear => {
    bear.addEventListener("click", (ev) => {
      ev.stopPropagation(); // map のクリックイベントに流さない

      const info = bear.dataset.info || "詳細情報なし";
      const p = createPopup();
      p.textContent = info;

      // 位置計算：getBoundingClientRect を使い、map-container を基準にする
      const bearRect = bear.getBoundingClientRect();
      const mapRect = map.getBoundingClientRect();

      // ポップ幅を一旦非表示で計測（必要があれば）
      p.style.left = "0px";
      p.style.top = "0px";
      p.classList.add("show");
      // 余裕を持たせて中央上に出す
      const popupRect = p.getBoundingClientRect();
      const left = bearRect.left - mapRect.left + (bearRect.width - popupRect.width) / 2;
      let top = bearRect.top - mapRect.top - popupRect.height - 8; // 上に8px余裕

      // 画面端で切れないように制限（左端・右端）
      const minLeft = 8;
      const maxLeft = mapRect.width - popupRect.width - 8;
      const clampedLeft = Math.min(Math.max(left, minLeft), maxLeft);
      if (top < 8) {
        // 上に出すスペースがなければ下に表示
        top = bearRect.top - mapRect.top + bearRect.height + 8;
      }

      p.style.left = `${clampedLeft}px`;
      p.style.top = `${top}px`;

      // 再度クラス付与（念のため）
      requestAnimationFrame(() => p.classList.add("show"));
    });
  });

  // マップをクリックしたら閉じる（空白クリック）
  map.addEventListener("click", () => {
    if (popup) {
      popup.classList.remove("show");
      // 少し後で DOM から削除しておく（アニメーションを優先）
      setTimeout(() => {
        if (popup && !popup.classList.contains("show")) {
          popup.remove();
          popup = null;
        }
      }, 200);
    }
  });
});
