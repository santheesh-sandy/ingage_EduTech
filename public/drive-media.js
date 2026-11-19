/* ingage EduTech – course slides and videos served from Google Drive
 * Slides:  https://drive.google.com/drive/folders/1nHlmdKS4JG8qha2oZE8uQ81uNbpjILp1  (PPTX + pdf/ subfolder)
 * Videos:  https://drive.google.com/drive/folders/1rgQHxH3ty9FciwXc7lhAHVOdHt9-V-Ko
 * The files must be shared as "Anyone with the link – Viewer" so learners can open them.
 * To use files hosted next to index.html instead (slides/…, videos/…), set DRIVE_MEDIA.on = false.
 */
(function (w, d) {
  'use strict';
  var DM = (w.DRIVE_MEDIA = {
    on: true,
    // deck id → [PPTX file id, PDF file id]
    slides: {
      'M1-1': ['1rBOBCebSgcr550YKilX-zsq0mttRFJ-9', '1tMm-Os3oo6Qpf8L1xEV82_zxn9SNGy0p'],
      'M1-2': ['1JT79pshDrN2HlwFw1uJPZsMQZHKLgZdg', '1zlC8NyeRbg7YjQWqB7j6XJPaeKcMMptr'],
      'M1-3': ['1wczgHhn2S5F3kmVMkQOgWRbkdZTGPfwT', '1EQQ50JvZ5MT04Fi7oo3R7lvKU1Uly6xC'],
      'M2-1': ['1ycQOXhgf3YikC_VObflWbaG0UFDnZ7z9', '1SfJrvqsBI1g7N_cG6udoQy2PO5--kWpm'],
      'M2-2': ['1LTgWurnjKZmeuVYcaBQdeVehruEUNdtU', '1PpiJwH4tksvs8rd2ww809_UEVNs8xhDk'],
      'M2-3': ['1_4MFoAxowpPDYNaD6hxKNYi1O9dkpfQO', '13_AcWNYPt5KsZqUFfXR9OIuwFih58O6-'],
      'M3-1': ['1dNu59ONux9mPMtYeFfNoDaro7OEZRkCg', '10qYIaD3qR7_KblEM4hMlH3f6Fqlglh2z'],
      'M3-2': ['1Gdl-i5acMQVzqzKgjLadcjppBLwfuXyR', '1v1gfxaJCAOmZARsRrissDSJoUSoKNKvO'],
      'M3-3': ['12ST0M092HzMgPwUw9b-7mzO3datknPoe', '1MezPbtzxDWE6LJU86NKgR41cXKvz2IRx'],
      'M4-1': ['10KodEnbV9DEKqqkkv7ZpnVFBw8agFqTs', '1-bSNcru5rCUAD7tvZPFjxGRbUgunSdVz'],
      'M4-2': ['1B41D57D_xJU1g-5eV5tG8fL4P_1IWhQd', '15hg2z3PC7OSukG9Xn85YJDSihWvSCJ4j'],
      'M4-3': ['1n0L_Wx0RZ2Czyrpo3dHRQ12yPSHrAPTG', '1b3CTj1ac08a_6i8qAClOIfMdjVd5ttkK'],
      'M5-1': ['1TcDenm-tNO4hg5Dlv75xvjMXRNOwNJdu', '1nWJlv6x1srsd72KALvPeq0i4CfZnHRcr'],
      'M5-2': ['1XlXNhGTbjJY_YIS6quC29PdMdIdc5gk8', '1hnBrMXXksr9GObFihE1keBAxEAZKkviu'],
      'M5-3': ['1pD0ZWxCR0-v7xDSPMswDNrBmX-D0QQIO', '1hRMBozL1mHp3Eup8fe7_bYRmgwYvWVmv'],
      'M6-1': ['1jdpFm7d1cwnyyPNAkW0GKdo8h6bn4yvW', '1uUoQ_l1_ludtjD9dUydiIQ7u6ocPy_3c'],
      'M6-2': ['1cvuhCcMIwT0KpHzOxT-rYZbccxAI7D2Z', '120u6scw-qQGOxZiTexiR9BJJLK4dRnLd'],
      'M6-3': ['1-jcbr-C01xVBMtnKH2hXFu2p3KH_JAou', '16Hq3l9R-oUhi0DrzaInqPqxhZR1vxng0'],
      'M7-1': ['1L7ZyiVsukrgutggNVfHl7DTOhj3eCxqc', '1-oshyfcZ9l9VYnzu1sazQE6KvNA753vU'],
      'M7-2': ['1qj3dtNnAlN_2fucp4UMQieEeWnCu5rWj', '1T-K70LVKkVhuhxqNdlbISGkkOEbo1Icw'],
      'M7-3': ['1yJNeYkAh3YWZxAY_uCLs2rdv7GvG_jIN', '14e5B5cMBuge9bj876FMxPJws9EQqZqpu'],
      'M8-1': ['1BOCKgO7WXhXyO3W6WgDIPiM75njN794P', '1DY0dtpuFDwn71MVlCGLTZBn8vFfOx7gA'],
      'M8-2': ['1UvoiCo4pMR75bcZhJsjA_au49U5GpSyB', '1xrrkpiUoDermXzqbm5MDZIjLGlmkLb1f'],
      'M8-3': ['1IpaoonEzw5ShsNT3hzKpT02Wk6SFRZwh', '1b4dBohGBGVJ9efAxCOc5Mz3NMFFLw2Ij'],
      'M9-1': ['1bIV0YZQ-bqQjBvL2RbX5JOErZke9Swyx', '11mw7GHN7XN9_tMUW1V1PQVgiOetroJrL'],
      'M9-2': ['1IMblKSIVoZTq40Gyj_8aQtviFbvXznR1', '1McpXwaEo6ztd8ry0mMKiRA4FEaouKYcq'],
      'M9-3': ['19CyQAi69pEycGBZ9r12jia7FyXDep_hE', '1MtniHauGyimto_CrrqzEg_OSEDufw4EQ'],
      'M10-1': ['1JFCmFSTNYG47aw9whnUu0DELbX6IX8RS', '1GF0FuVm72Ufs8VUPe85T9afwaUVsIEKA'],
      'M10-2': ['1q9k-u4l6vCU6qwNSSv54Q_e5SZSOfyJI', '1FEqYzEFTBuRaIES2fCOHpa9sy5ZyiIur'],
      'M10-3': ['1TyNMASgtv9jNAM9E6uU64CzDmijd5wCT', '138JFqh6PF0xE1JeEu0u3uWUNHzBSIY90'],
    },
    // video number (as in "Video 22-…") → [Drive file id, title]
    videos: {
      1: ['1BEb3ga19mrMyouMRAui9mcXpxnm2xP-t', 'Cisco Packet Tracer'],
      2: ['13Da96np_IQD2Chy1G8JC1e859fbsEooj', 'Hub configuration'],
      3: ['1sdqS1X14cucZ62mP-2KEyUj1Zh3RCSGM', 'Switch and router'],
      4: ['1NRhMlMShfPZ5Z5l7K8ehf8jhPSnjVFly', 'Static routing'],
      5: ['1tIHxrJAkAs1BGdf_4Omg3s-ypMYRZejB', 'Static (continued) and dynamic routing'],
      6: ['1t2HHCOpBwhvTgVLozwQgw1ZlKgZQxmaF', 'GNS3 intro and switch configuration'],
      7: ['1cOF6AApBOUWCr7WnrmUYGQ3Z_lGpDKCs', 'GNS3 router configuration'],
      8: ['1iI2q_gDIcB2aS7p53ulO0QjQxuzNFzrw', 'GNS3 RIP routing configuration'],
      9: ['1hTqi3kzFVYcU8NE1f11xjDvWuxM_upju', 'Traffic capture in Wireshark from GNS3'],
      10: ['1moNlxMxJpzkJ_OXmCVJOqSOf7KHkMrih', 'DHCP and DNS'],
      11: ['162zP8qsdZpSZundzvUc3HgU_zCyiZfHA', 'Introduction to virtualization'],
      12: ['1Lwie9DiXc0a57LKGkn4GhAkGVdGEM5PA', 'Download and install VirtualBox'],
      13: ['1Cvl0ojKKHLGUkXsRisq68wnq51bAC0jj', 'Introduction to Windows Server 2019'],
      14: ['1zOIUM8vIPZHVaIlMzsq6wyC6mkIf8OdX', 'VM creation and Windows Server 2019 installation'],
      15: ['1H6lWV0O2sqauSC81fWcI_Eh9XNILN8Gr', 'Changing the system name'],
      16: ['1NOdL1sWlsEcovCRcLl5GZ1bBD84U9Z95', 'Network adapters'],
      17: ['1daM8egxbIV71UZM1M-8fTBT0JKRxQM89', 'Introduction to Active Directory'],
      18: ['1MVHkh1pNvj9DrFMJ499Z_nWSuqSCbwnq', 'Installing Active Directory Domain Services'],
      19: ['1iZNi8-vzVd4Ff0mFEjnpjxLOHvgQ23xU', 'Windows 10 installation'],
      20: ['1QYd2wZLubAYimeFMb3i-8_rOIST-4MVq', 'Joining a user PC to the domain'],
      21: ['17A47v46mLjXXFqBlPeo0yfe7nOwVIsoj', 'Group Policy creation'],
      22: ['19HnIFUW7uyiGZ_LFeAnlzsWdAuI4RwKr', 'DNS service configuration'],
      23: ['1Yv8HWPKk0PVXnr-SjGv6JJve2yBuB6bp', 'DHCP service configuration'],
      24: ['1swafhBnvJ8YyLMTCqmxyhpO9tekcOJ3q', 'VPN configuration'],
      25: ['1sV3La6Rw7iOo6VN_fo4W1Q2lcTdRuR-q', 'File sharing through IP'],
    },
  });

  var G = 'https://drive.google.com/';
  DM.preview = function (id) { return G + 'file/d/' + id + '/preview'; };
  DM.view = function (id) { return G + 'file/d/' + id + '/view'; };
  DM.download = function (id) { return G + 'uc?export=download&id=' + id; };
  DM.deckOf = function (path) { var m = /(M\d+-\d+)\.(pptx|pdf)/i.exec(String(path)); return m ? m[1].toUpperCase() : null; };
  DM.vidNo = function (path) { var m = /(\d+)/.exec(String(path).replace(/^videos\//, '')); return m ? +m[1] : null; };
  DM.slideIds = function (path) { var k = DM.deckOf(path); return k && DM.slides[k]; };
  DM.videoOf = function (path) { var n = DM.vidNo(path); return n != null ? DM.videos[n] : null; };

  function esc(s) { return w.esc(String(s)); }

  // Replace local slide/video players in the learning page with Google Drive players.
  function apply() {
    if (!DM.on) return;
    var lw = w.$('lw');
    if (!lw) return;
    lw.querySelectorAll('.pv iframe').forEach(function (f) {
      var ids = DM.slideIds(f.getAttribute('src'));
      if (!ids) return;
      f.src = DM.preview(ids[1]);
      f.setAttribute('allow', 'fullscreen');
      f.setAttribute('loading', 'lazy');
      var bar = f.closest('.pv').nextElementSibling;
      if (bar && bar.classList.contains('pvb')) {
        bar.querySelectorAll('a').forEach(function (a) {
          if (/Full screen/i.test(a.textContent)) a.href = DM.view(ids[1]);
          if (/Download/i.test(a.textContent)) { a.href = DM.download(ids[0]); a.removeAttribute('download'); a.target = '_blank'; a.rel = 'noopener'; }
        });
        var meta = bar.querySelector('.meta');
        if (meta) meta.textContent = meta.textContent.replace('scroll inside the viewer', 'scroll inside the viewer · from Google Drive');
      }
    });
    lw.querySelectorAll('video.uv').forEach(function (v) {
      var hit = DM.videoOf(v.getAttribute('data-p'));
      if (!hit) return;
      var box = d.createElement('div');
      box.className = 'dv';
      box.innerHTML = '<iframe src="' + DM.preview(hit[0]) + '" title="' + esc('Video ' + DM.vidNo(v.getAttribute('data-p')) + ': ' + hit[1]) +
        '" allow="autoplay; fullscreen; encrypted-media" allowfullscreen loading="lazy"></iframe>' +
        '<div class="dvb"><span class="meta">🎬 ' + esc(hit[1]) + ' · from Google Drive</span>' +
        '<a class="btn o" href="' + DM.view(hit[0]) + '" target="_blank" rel="noopener">⤢ Open in Drive</a></div>' +
        '<p class="meta dvn">When you finish the video, press <b>Mark complete & continue</b>.</p>';
      var hd = v.previousElementSibling;
      if (hd && hd.tagName == 'H4' && /^Part \d+ of \d+:/.test(hd.textContent)) hd.textContent = hd.textContent.replace(/:.*$/, ': ' + hit[1]);
      v.parentNode.replaceChild(box, v);
    });
  }
  DM.apply = apply;
  var _renderLearn = w.renderLearn;
  w.renderLearn = function () { _renderLearn(); apply(); };
  if (location.hash == '#learn' && w.US && w.$('lw') && w.$('lw').innerHTML) apply();
})(window, document);
