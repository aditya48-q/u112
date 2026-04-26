(function () {
  const STORAGE_KEY = "portfolio-theme";
  const toggleButton = document.getElementById("theme-toggle");
  const scrollTopButton = document.getElementById("scroll-to-top");
  const navLinks = document.querySelectorAll(".nav-list a[href^='#']");
  const sections = document.querySelectorAll("main section[id]");
  const motionTargets = document.querySelectorAll(
    ".portfolio-card, .project-card, .skill-pill, .link-button, .hero-copy, .hero-visual"
  );
  const html = document.documentElement;

  function setIcon(theme) {
    if (!toggleButton) {
      return;
    }

    const icon = toggleButton.querySelector("i");
    if (!icon) {
      return;
    }

    icon.classList.remove("fa-moon", "fa-sun");
    if (theme === "dark") {
      icon.classList.add("fa-sun");
      toggleButton.setAttribute("aria-label", "Switch to light mode");
      toggleButton.setAttribute("title", "Switch to light mode");
    } else {
      icon.classList.add("fa-moon");
      toggleButton.setAttribute("aria-label", "Switch to dark mode");
      toggleButton.setAttribute("title", "Switch to dark mode");
    }
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }
    setIcon(theme);
  }

  function setupMotionTarget(element, delay, motionDirection) {
    element.classList.add("motion-entry");
    element.dataset.motion = motionDirection;

    if (typeof delay === "number") {
      element.style.setProperty("--motion-delay", delay.toFixed(1) + "s");
    }
  }

  function initializeMotionTargets() {
    const projectCards = document.querySelectorAll(".project-card");
    const skillPills = document.querySelectorAll(".skill-pill");

    motionTargets.forEach(function (element) {
      if (element.classList.contains("hero-copy")) {
        setupMotionTarget(element, 0.2, "left");
        return;
      }

      if (element.classList.contains("hero-visual")) {
        setupMotionTarget(element, 0.4, "right");
        return;
      }

      setupMotionTarget(element, 0, "up");
    });

    projectCards.forEach(function (element, index) {
      setupMotionTarget(element, (index + 1) * 0.1, "up");
    });

    skillPills.forEach(function (element, index) {
      setupMotionTarget(element, (index + 1) * 0.1, "up");
    });
  }

  function revealMotionTargets() {
    if (!motionTargets.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      motionTargets.forEach(function (element) {
        element.classList.add("animate-in");
      });
      return;
    }

    const motionObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("animate-in");
          entry.target.addEventListener(
            "transitionend",
            function handleMotionEnd(event) {
              if (event.target !== entry.target) {
                return;
              }

              entry.target.style.setProperty("--motion-delay", "0s");
              entry.target.removeEventListener("transitionend", handleMotionEnd);
            }
          );

          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.18,
      }
    );

    motionTargets.forEach(function (element) {
      motionObserver.observe(element);
    });
  }

  const storedTheme = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

  applyTheme(initialTheme);

  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      const currentTheme = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem(STORAGE_KEY, nextTheme);
    });
  }

  if (scrollTopButton) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollTopButton.classList.add("show");
      } else {
        scrollTopButton.classList.remove("show");
      }
    });

    scrollTopButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  initializeMotionTargets();
  revealMotionTargets();

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          const activeId = entry.target.id;
          navLinks.forEach(function (link) {
            const isActive = link.getAttribute("href") === "#" + activeId;
            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: 0.2,
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
})();
