// ---- CONG VAO WEBSITE: "MAI THICH HELLO KITTY KHUM?" ----
// Bam vao "Co" hoac "Khong" thi ca 2 nut deu nhay lung tung khap man hinh.
// Bam qua 3 lan (tren ca 2 nut cong lai) thi nut "Thich Anh co" se hien ra,
// bam vao nut do se tu dong mo khoa vao trang web chinh.

const REMEMBER_UNLOCK = true;
const STORAGE_KEY = "vutru-tinh-yeu-unlocked";
const MAX_CLICKS = 3;

(function () {
  const gate = document.getElementById("password-gate");
  const box = gate.querySelector(".password-box");
  const btnCo = document.getElementById("btn-co");
  const btnKhong = document.getElementById("btn-khong");
  const btnThichAnh = document.getElementById("btn-thichanh");
  const error = document.getElementById("password-error");
  const music = document.getElementById("bg-music");

  let clickCount = 0;

  // Neu trinh duyet chan autoplay (khong co tuong tac nguoi dung),
  // se tu dong thu phat lai nhac ngay lan click/cham dau tien tren trang.
  function ensureMusicPlays() {
    if (!music) return;
    const tryPlay = function () {
      music.play().catch(function () {
        /* ignore, se thu lai o lan tuong tac ke tiep */
      });
    };
    tryPlay();
    const retryOnInteraction = function () {
      tryPlay();
      document.removeEventListener("click", retryOnInteraction);
      document.removeEventListener("touchstart", retryOnInteraction);
      document.removeEventListener("keydown", retryOnInteraction);
    };
    document.addEventListener("click", retryOnInteraction);
    document.addEventListener("touchstart", retryOnInteraction);
    document.addEventListener("keydown", retryOnInteraction);
  }

  function unlock() {
    gate.classList.add("unlocked");
    document.body.classList.add("gate-unlocked");
    ensureMusicPlays();
    if (REMEMBER_UNLOCK) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch (e) {
        /* ignore storage errors */
      }
    }
    setTimeout(function () {
      gate.style.display = "none";
    }, 700);
  }

  function randomPositionFor(el) {
    const rect = el.getBoundingClientRect();
    const margin = 12;
    const maxX = Math.max(0, window.innerWidth - rect.width - margin * 2);
    const maxY = Math.max(0, window.innerHeight - rect.height - margin * 2);
    return {
      x: margin + Math.random() * maxX,
      y: margin + Math.random() * maxY
    };
  }

  function jumpAway(el) {
    const pos = randomPositionFor(el);
    el.style.position = "fixed";
    el.style.left = pos.x + "px";
    el.style.top = pos.y + "px";
    el.classList.add("jumping");
  }

  function showThichAnh() {
    if (!btnThichAnh.classList.contains("show")) {
      btnThichAnh.classList.remove("hidden");
      btnThichAnh.classList.add("show");
    }
  }

  function handleChoiceClick(clickedBtn, otherBtn) {
    clickCount++;
    error.classList.add("show");
    box.classList.add("shake");
    setTimeout(function () {
      box.classList.remove("shake");
    }, 400);

    // Ca 2 nut deu nhay sang vi tri ngau nhien tren man hinh
    jumpAway(clickedBtn);
    jumpAway(otherBtn);

    if (clickCount > MAX_CLICKS) {
      showThichAnh();
    }
  }

  function alreadyUnlocked() {
    if (!REMEMBER_UNLOCK) return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  if (alreadyUnlocked()) {
    unlock();
  } else {
    btnCo.addEventListener("click", function (e) {
      e.preventDefault();
      handleChoiceClick(btnCo, btnKhong);
    });

    btnKhong.addEventListener("click", function (e) {
      e.preventDefault();
      handleChoiceClick(btnKhong, btnCo);
    });

    btnThichAnh.addEventListener("click", function (e) {
      e.preventDefault();
      unlock();
    });
  }
})();
