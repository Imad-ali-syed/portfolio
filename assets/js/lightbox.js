// Photo lightbox. Any <img data-lightbox> opens full size when clicked.
// Images inside the same [data-gallery] element can be stepped through with the
// arrow keys or the on-screen arrows. Esc, the X, or a click on the backdrop closes it.
(function () {
  var box, pic, cap, prev, next, group = [], idx = 0;

  function el(tag, css, html) {
    var e = document.createElement(tag);
    e.style.cssText = css;
    if (html) { e.innerHTML = html; }
    return e;
  }

  function build() {
    box = el('div', 'position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.92);padding:1rem;');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    var fig = el('figure', 'margin:0;max-width:min(1200px,100%);max-height:100%;display:flex;flex-direction:column;align-items:center;');
    pic = el('img', 'max-width:100%;max-height:84vh;border-radius:.5rem;box-shadow:0 20px 60px rgba(0,0,0,.6);');
    cap = el('figcaption', 'color:#d1d5db;font:14px/1.5 Inter,system-ui,sans-serif;margin-top:.75rem;text-align:center;max-width:60ch;');
    var btn = 'position:absolute;background:rgba(31,41,55,.85);color:#fff;border:1px solid #4b5563;border-radius:9999px;width:44px;height:44px;font-size:22px;line-height:1;cursor:pointer;';
    var close = el('button', btn + 'top:1rem;right:1rem;', '&times;');
    close.setAttribute('aria-label', 'Close photo');
    prev = el('button', btn + 'left:1rem;top:50%;transform:translateY(-50%);', '&#8249;');
    prev.setAttribute('aria-label', 'Previous photo');
    next = el('button', btn + 'right:1rem;top:50%;transform:translateY(-50%);', '&#8250;');
    next.setAttribute('aria-label', 'Next photo');
    fig.appendChild(pic); fig.appendChild(cap);
    box.appendChild(fig); box.appendChild(close); box.appendChild(prev); box.appendChild(next);
    document.body.appendChild(box);
    close.addEventListener('click', hide);
    prev.addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    next.addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) { hide(); } });
    document.addEventListener('keydown', function (e) {
      if (box.style.display === 'none') { return; }
      if (e.key === 'Escape') { hide(); }
      if (e.key === 'ArrowLeft') { show(idx - 1); }
      if (e.key === 'ArrowRight') { show(idx + 1); }
    });
  }

  function show(i) {
    idx = (i + group.length) % group.length;
    var img = group[idx];
    pic.src = img.getAttribute('data-full') || img.currentSrc || img.src;
    pic.alt = img.alt;
    var fc = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    cap.textContent = fc ? fc.textContent : img.alt;
    var many = group.length > 1;
    prev.style.display = many ? 'block' : 'none';
    next.style.display = many ? 'block' : 'none';
    box.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function hide() {
    box.style.display = 'none';
    pic.removeAttribute('src');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('img[data-lightbox]');
    // A link marked data-open-gallery opens the first photo of its gallery
    // (its own [data-gallery] parent, or the element whose id is the attribute's value).
    var opener = !img && e.target.closest && e.target.closest('[data-open-gallery]');
    if (opener) {
      e.preventDefault();
      var id = opener.getAttribute('data-open-gallery');
      var scope = (id && document.getElementById(id)) || opener.closest('[data-gallery]');
      img = scope && scope.querySelector('img[data-lightbox]');
    }
    if (!img) { return; }
    if (!box) { build(); }
    var g = img.closest('[data-gallery]');
    group = g ? Array.prototype.slice.call(g.querySelectorAll('img[data-lightbox]')) : [img];
    show(group.indexOf(img));
  });
})();
