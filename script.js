// ======================================================
// MENU / DRAWER
// ======================================================

const menuButton = document.querySelector('.menu-button');
const drawer = document.querySelector('.drawer');
const drawerClose = document.querySelector('.drawer-close');

function openDrawer() {
  drawer?.classList.add('open');
  drawer?.setAttribute('aria-hidden', 'false');
  menuButton?.setAttribute('aria-expanded', 'true');
}

function closeDrawer() {
  drawer?.classList.remove('open');
  drawer?.setAttribute('aria-hidden', 'true');
  menuButton?.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);

// Close the drawer when the visitor clicks anywhere outside it.
document.addEventListener('click', e => {
  if (
    drawer?.classList.contains('open') &&
    !drawer.contains(e.target) &&
    !menuButton?.contains(e.target)
  ) {
    closeDrawer();
  }
});

document.querySelectorAll('.drawer a').forEach(link => {
  link.addEventListener('click', () => {
    closeDrawer();
  });
});

document.querySelectorAll('.submenu-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const group = toggle.closest('.menu-group');
    const submenu = group?.querySelector('.submenu');
    const open = group?.classList.toggle('open');

    toggle.setAttribute('aria-expanded', String(!!open));
    submenu?.setAttribute('aria-hidden', String(!open));
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeDrawer();
  }
});


/*
// ======================================================
// EMAIL SIGN-UP FORM
// ======================================================

document.querySelector('.email-form')?.addEventListener('submit', e => {
  e.preventDefault();

  const button = e.currentTarget.querySelector('button');

  if (button) {
    button.textContent = 'THANK YOU';
  }
});
*/

// ======================================================
// SUBSCRIBE POPUP
// ======================================================

const signupClose = document.querySelector('.signup-close');
const signupOverlay = document.querySelector('.signup-overlay');
const subscribeLink = document.querySelector('.subscribe-link');

const SUBSCRIBE_DISMISS_KEY = 'subscribePopupDismissed';
const SUBSCRIBE_COMPLETE_KEY = 'subscribePopupSubscribed';
const SUBSCRIBE_DELAY = 5000;
const SUBSCRIBE_DISMISS_DAYS = 30;

function showSignupOverlay() {
  signupOverlay?.removeAttribute('hidden');
}

function hideSignupOverlay(rememberDismissal = true) {
  signupOverlay?.setAttribute('hidden', '');

  if (rememberDismissal) {
    try {
      localStorage.setItem(SUBSCRIBE_DISMISS_KEY, String(Date.now()));
    } catch (error) {}
  }
}

function shouldShowSignupOverlay() {
  try {
    if (localStorage.getItem(SUBSCRIBE_COMPLETE_KEY) === 'true') {
      return false;
    }

    const dismissedAt = Number(localStorage.getItem(SUBSCRIBE_DISMISS_KEY));
    if (dismissedAt) {
      const thirtyDays = SUBSCRIBE_DISMISS_DAYS * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedAt < thirtyDays) {
        return false;
      }
    }
  } catch (error) {}

  return true;
}

if (signupOverlay && shouldShowSignupOverlay()) {
  window.setTimeout(showSignupOverlay, SUBSCRIBE_DELAY);
}

signupClose?.addEventListener('click', () => {
  hideSignupOverlay(true);
});

signupOverlay?.addEventListener('click', e => {
  if (e.target === signupOverlay) {
    hideSignupOverlay(true);
  }
});

subscribeLink?.addEventListener('click', () => {
  showSignupOverlay();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && signupOverlay && !signupOverlay.hidden) {
    hideSignupOverlay(true);
  }
});


// ======================================================
// ARTWORK THEME FILTER
// ======================================================

const params = new URLSearchParams(window.location.search);
const theme = (params.get('theme') || '').toLowerCase();

const validThemes = [
  'red',
  'blue',
  'black',
  'gold',
  'white'
];

const artworkGrid = document.querySelector('.artwork-grid');

if (artworkGrid) {

  const artworkItems =
    document.querySelectorAll('.grid-art');

  if (validThemes.includes(theme)) {

    artworkItems.forEach(item => {

      const itemTheme =
        (item.dataset.theme || '').toLowerCase();

      if (itemTheme === theme) {
        item.classList.remove('is-hidden');
      } else {
        item.classList.add('is-hidden');
      }

    });

    const label =
      document.querySelector('.active-theme-label');

    if (label) {
      label.textContent =
        theme.charAt(0).toUpperCase() +
        theme.slice(1);
    }

  } else {

    // No theme selected = show everything
    artworkItems.forEach(item => {
      item.classList.remove('is-hidden');
    });

    const label =
      document.querySelector('.active-theme-label');

    if (label) {
      label.textContent = 'ALL';
    }

  }
}

// ======================================================
// ARTWORK DETAIL PAGE
// ======================================================

if (window.ARTWORKS) {

  const artworkId = params.get('id') || '01';
  const imageFile = params.get('image');

  const detailImage =
    document.getElementById('detail-image');

  const artwork = window.ARTWORKS[artworkId];

  if (artwork && detailImage) {

    document.title =
      artwork.title + ' — SIHYEON PARK';


    // If the image filename was passed from artwork.html,
    // use that high-resolution image.
    if (imageFile) {

      detailImage.src =
        'images/' + imageFile;

    }

    // Otherwise use the filename stored in artworks.js.
    else if (artwork.image) {

      detailImage.src =
        'images/' + artwork.image;

    }


    detailImage.alt =
      artwork.title || 'Artwork';


    const detailTheme =
      document.getElementById('detail-theme');

    const detailTitle =
      document.getElementById('detail-title');

    const detailYear =
      document.getElementById('detail-year');

    const detailMedium =
      document.getElementById('detail-medium');

    const detailSize =
      document.getElementById('detail-size');

    const detailDescription =
      document.getElementById('detail-description');

    const inquiryArtwork =
      document.getElementById('inquiry-artwork');


    if (detailTheme) {
      detailTheme.textContent =
        artwork.theme || '';
    }

    if (detailTitle) {
      detailTitle.textContent =
        artwork.title || '';
    }

    if (detailYear) {
      detailYear.textContent =
        artwork.year || '';
    }

    if (detailMedium) {
      detailMedium.textContent =
        artwork.medium || '';
    }

    if (detailSize) {
      detailSize.textContent =
        artwork.size || '';
    }

    if (detailDescription) {
      detailDescription.textContent =
        artwork.description || '';
    }

    if (inquiryArtwork) {
      inquiryArtwork.value =
        artwork.title || '';
    }

    // ======================================================
    // ARTWORK AVAILABILITY
    // ======================================================

    const inquiryForm =
      document.querySelector('.inquiry-form');

    const availabilityLabel =
      document.getElementById('detail-availability');

    const availability =
      (artwork.availability || 'available').trim().toLowerCase();

    if (inquiryForm && availabilityLabel) {
      if (availability === 'sold') {
        inquiryForm.style.display = 'none';
        availabilityLabel.textContent = 'SOLD';
        availabilityLabel.hidden = false;
      } else if (availability === 'not_for_sale') {
        inquiryForm.style.display = 'none';
        availabilityLabel.textContent = 'NOT FOR SALE';
        availabilityLabel.hidden = false;
      } else {
        inquiryForm.style.display = '';
        availabilityLabel.textContent = '';
        availabilityLabel.hidden = true;
      }
    }

  }
}

// ======================================================
// ARTWORK GRID TITLES FROM artworks.js
// ======================================================

document.querySelectorAll('.grid-art').forEach(item => {
  const url = new URL(item.href, location.href);
  const artworkId = url.searchParams.get('id');
  if (!artworkId || !window.ARTWORKS) {
    return;
  }

  const artwork = window.ARTWORKS[artworkId];
  const titleElement = item.querySelector('span');
  if (artwork && titleElement) {
    titleElement.textContent = artwork.title || '';
  }
});

// ======================================================
// ARTWORK GRID
//
// 1. Save current archive URL.
// 2. Save current scroll position.
// 3. Send thumbnail filename to detail page.
// ======================================================

document.querySelectorAll('.grid-art').forEach(item => {

  item.addEventListener('click', e => {

    // Save exactly where the visitor currently is.
    sessionStorage.setItem(
      'artworkScrollY',
      String(window.scrollY)
    );

    // This also saves theme filters such as:
    // artwork.html?theme=red
    sessionStorage.setItem(
      'artworkURL',
      location.href
    );


    const img = item.querySelector('img');

    if (!img) {
      return;
    }


    const src = img.getAttribute('src');

    if (!src) {
      return;
    }


    // New artwork thumbnails are stored in images_thumbs.
    // Pass the same filename to the detail page.
    if (src.includes('images_thumbs/')) {

      e.preventDefault();

      const filename =
        src.replace('images_thumbs/', '');

      const url =
        new URL(item.href, location.href);

      url.searchParams.set(
        'image',
        filename
      );

      location.href = url.href;
    }

  });

});


// ======================================================
// RESTORE ARTWORK PAGE SCROLL POSITION
// ======================================================

if (artworkGrid) {

  const savedScrollY =
    sessionStorage.getItem('artworkScrollY');

  const savedArtworkURL =
    sessionStorage.getItem('artworkURL');


  // Only restore the position when we have returned
  // to the same artwork/archive URL.
  if (
    savedScrollY !== null &&
    savedArtworkURL === location.href
  ) {

    window.addEventListener('load', () => {

      // Give the artwork images a moment to establish
      // the page layout before restoring the position.
      setTimeout(() => {

        window.scrollTo({
          top: Number(savedScrollY),
          left: 0,
          behavior: 'auto'
        });

        // Clear the saved position after restoring it.
        sessionStorage.removeItem(
          'artworkScrollY'
        );

      }, 100);

    });

  }

}


// ======================================================
// BACK TO ARTWORK
// ======================================================

const backArtwork =
  document.querySelector('.back-artwork');

backArtwork?.addEventListener('click', e => {

  e.preventDefault();

  const previousArtworkURL =
    sessionStorage.getItem('artworkURL');


  if (previousArtworkURL) {

    // Return to the exact archive URL,
    // including the selected theme.
    location.href =
      previousArtworkURL;

  }

  else {

    // Fallback if the visitor opened
    // the detail page directly.
    location.href =
      'artwork.html';

  }

});

/*
// ======================================================
// INQUIRY FORM
// ======================================================

document.querySelector('.inquiry-form')
  ?.addEventListener('submit', e => {

    e.preventDefault();

    const status =
      e.currentTarget.querySelector(
        '.inquiry-status'
      );

    if (status) {
      status.textContent =
        'Thank you. Your inquiry has been prepared for submission.';
    }

  });
*/


// ======================================================
// SMALLS COLLECTION DETAIL PAGE
// ======================================================
const smallsDetailImage = document.getElementById('smalls-detail-image');
if (smallsDetailImage && window.SMALLS_COLLECTION) {
  const smallsId = new URLSearchParams(window.location.search).get('id') || 'print-01';
  const item = window.SMALLS_COLLECTION[smallsId] || window.SMALLS_COLLECTION['print-01'];
  const category = document.getElementById('smalls-detail-category');
  const title = document.getElementById('smalls-detail-title');
  const description = document.getElementById('smalls-detail-description');
  const inquiryArtwork = document.getElementById('inquiry-artwork');
  document.title = item.title + ' — SIHYEON PARK';
  smallsDetailImage.src = 'images/' + item.image;
  smallsDetailImage.alt = item.title;
  if (category) category.textContent = item.category || '';
  if (title) title.textContent = item.title || '';
  if (description) {
    description.innerHTML = '';
    const list = document.createElement('ul');
    (item.description || []).forEach(line => {
      const listItem = document.createElement('li');
      listItem.textContent = line;
      list.appendChild(listItem);
    });
    description.appendChild(list);
  }
  if (inquiryArtwork) inquiryArtwork.value = item.title || '';

  // ======================================================
  // SELECT GOOGLE FORM BASED ON SMALLS CATEGORY
  // ======================================================
  const inquiryForm =
    document.getElementById('smalls-inquiry-form');
  if (inquiryForm) {
    const isPrintGoods =
      item.category === 'Print Goods';
    if (isPrintGoods) {
      // PRINT GOODS GOOGLE FORM
      inquiryForm.action =
        'https://docs.google.com/forms/d/e/1FAIpQLSdA2dzr9Yxu_UFSTjTy1j8aWNp4l-rk5ogEXluIiy0ahd78qQ/formResponse';
      document.getElementById('inquiry-artwork').name =
        'entry.1048397201';
      document.getElementById('inquiry-name').name =
        'entry.1479629899';
      document.getElementById('inquiry-phone').name =
        'entry.102635492';
      document.getElementById('inquiry-email').name =
        'entry.457924720';
      document.getElementById('inquiry-message').name =
        'entry.811791661';
    } else {
      // ARTWORK PRINTS GOOGLE FORM
      inquiryForm.action =
        'https://docs.google.com/forms/d/e/1FAIpQLScATKFGkLbRrtD7NbG2kckd7Kiv8J0jaaF-qTNlnT27gMGDlQ/formResponse';
      document.getElementById('inquiry-artwork').name =
        'entry.1330799925';
      document.getElementById('inquiry-name').name =
        'entry.1611009759';
      document.getElementById('inquiry-phone').name =
        'entry.683800293';
      document.getElementById('inquiry-email').name =
        'entry.1917891432';
      document.getElementById('inquiry-message').name =
        'entry.1213731617';
    }
  }

}
