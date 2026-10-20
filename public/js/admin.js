// Admin helpers: confirmation prompts and photo uploads.
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  document.querySelectorAll('form[data-confirm]').forEach(function (f) {
    f.addEventListener('submit', function (e) { if (!confirm(f.getAttribute('data-confirm'))) e.preventDefault(); });
  });
  var token = document.getElementById('csrf-token');
  document.querySelectorAll('[data-photo-upload]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var file = f.querySelector('input[type=file]').files[0];
      var out = f.querySelector('.photo-status');
      if (!file) return;
      if (file.size > 6 * 1024 * 1024) { out.textContent = 'Image is larger than 6 MB.'; return; }
      out.textContent = 'Uploading…';
      var reader = new FileReader();
      reader.onload = function () {
        fetch('/api/admin/photos', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token.value }, body: JSON.stringify({ key: f.getAttribute('data-photo-upload'), data: reader.result }) })
          .then(function (r) { return r.json(); })
          .then(function (d) { out.textContent = d.ok ? 'Uploaded. Reloading…' : d.error; if (d.ok) setTimeout(function () { location.reload(); }, 600); })
          .catch(function () { out.textContent = 'Upload failed. Please try again.'; });
      };
      reader.readAsDataURL(file);
    });
  });
})();
