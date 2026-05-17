(() => {
  const brochurePages = [
    { src: "assets/brochure1.jpg", alt: "Brochure page 1" },
    { src: "assets/brochure2.jpg", alt: "Brochure page 2" },
    { src: "assets/brochure3.jpg", alt: "Brochure page 3" },
    { src: "assets/brochure4.jpg", alt: "Brochure page 4" },
    { src: "assets/brochure5.jpg", alt: "Brochure page 5" },
    { src: "assets/brochure6.jpg", alt: "Brochure page 6" }
  ];

  const modal = document.getElementById("brochureModal");
  const modalImage = modal?.querySelector("img");
  const modalClose = modal?.querySelector(".brochure-modal-close");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const isSinglePage = () => window.matchMedia("(max-width: 760px)").matches;

  const closeModal = () => {
    if (!modal || !modalImage) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
    modalImage.alt = "";
    document.body.style.overflow = "";
  };

  const openModal = (page) => {
    if (!modal || !modalImage || !page) return;

    modalImage.src = page.src;
    modalImage.alt = page.alt;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose?.focus();
  };

  const createPageButton = (page, index, side) => {
    const button = document.createElement("button");
    button.className = `brochure-page-image brochure-page-${side}`;
    button.type = "button";
    button.setAttribute("data-brochure-page", String(index));
    button.setAttribute("aria-label", `Open ${page.alt} larger`);

    const image = document.createElement("img");
    image.src = page.src;
    image.alt = page.alt;
    image.loading = index <= 1 ? "eager" : "lazy";
    image.decoding = "async";

    image.addEventListener("error", () => {
      image.classList.add("is-missing");
      image.alt = `${page.alt} - image file missing`;
    }, { once: true });

    button.appendChild(image);
    return button;
  };

  const initViewer = (viewer) => {
    const book = viewer.querySelector("[data-brochure-book]");
    const count = viewer.querySelector("[data-brochure-count]");
    const prev = viewer.querySelector("[data-brochure-prev]");
    const next = viewer.querySelector("[data-brochure-next]");
    if (!book || !count || !prev || !next) return;

    let currentIndex = 0;

    const clampIndex = (index) => {
      const step = isSinglePage() ? 1 : 2;
      const maxIndex = isSinglePage()
        ? brochurePages.length - 1
        : Math.max(0, brochurePages.length - step);

      return Math.min(Math.max(index, 0), maxIndex);
    };

    const render = (direction = "next") => {
      currentIndex = clampIndex(currentIndex);
      const single = isSinglePage();
      const visiblePages = single
        ? [brochurePages[currentIndex]]
        : brochurePages.slice(currentIndex, currentIndex + 2);

      book.classList.remove("is-turning-next", "is-turning-prev");
      if (!prefersReducedMotion.matches) {
        book.classList.add(direction === "prev" ? "is-turning-prev" : "is-turning-next");
      }

      book.replaceChildren();
      visiblePages.forEach((page, offset) => {
        if (!page) return;
        const side = single ? "single" : offset === 0 ? "left" : "right";
        book.appendChild(createPageButton(page, currentIndex + offset, side));
      });

      const pageLabel = single || visiblePages.length === 1
        ? `${currentIndex + 1}/${brochurePages.length}`
        : `${currentIndex + 1}/${brochurePages.length} - ${currentIndex + visiblePages.length}/${brochurePages.length}`;

      count.textContent = pageLabel;
      prev.disabled = currentIndex === 0;
      next.disabled = single
        ? currentIndex >= brochurePages.length - 1
        : currentIndex >= brochurePages.length - 2;
    };

    prev.addEventListener("click", () => {
      currentIndex -= isSinglePage() ? 1 : 2;
      render("prev");
    });

    next.addEventListener("click", () => {
      currentIndex += isSinglePage() ? 1 : 2;
      render("next");
    });

    book.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-brochure-page]");
      if (!trigger) return;

      const page = brochurePages[Number(trigger.dataset.brochurePage)];
      openModal(page);
    });

    window.addEventListener("resize", () => render("next"));
    render("next");
  };

  document.querySelectorAll("[data-brochure-viewer]").forEach(initViewer);

  document.addEventListener("click", (event) => {
    if (event.target === modal || event.target === modalClose) {
      closeModal();
      return;
    }

    const previewImage = event.target.closest(".brochure-viewer-preview .brochure-page-image img");
    if (previewImage) {
      const page = brochurePages.find((item) => previewImage.src.endsWith(item.src));
      if (page) openModal(page);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
})();
