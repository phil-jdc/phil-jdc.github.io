let msuIconHTML = "";

const linkGroups = {
  profile: [
    {
      href: "mailto:crowl131@msu.edu",
      label: "email",
      iconClass: "fa-regular fa-envelope",
      external: false
    },
    {
      href: "https://arxiv.org/search/?query=philip+crowley&searchtype=all&source=header",
      label: "arxiv",
      iconClass: "ai ai-arxiv",
      external: true
    },
    {
      href: "https://scholar.google.com/citations?user=FvCmptAAAAAJ",
      label: "google scholar",
      iconClass: "ai ai-google-scholar",
      external: true
    },
    {
      href: "https://orcid.org/0000-0002-9836-7569",
      label: "orcid",
      iconClass: "ai ai-orcid",
      external: true
    },
    {
      href: "https://directory.natsci.msu.edu/Directory/Profiles/Person/105521?org=60",
      label: "faculty directory",
      iconType: "msu",
      external: true
    }
  ]
};

function linkIcon(link) {
  if (link.iconType === "msu") {
    return msuIconHTML;
  }

  if (link.iconClass) {
    return `<i class="${link.iconClass}" aria-hidden="true"></i>`;
  }

  return "";
}

async function loadMSUIcon() {
  const response = await fetch("images/msu_icon.html");
  if (!response.ok) {
    throw new Error("Failed to load MSU icon partial");
  }
  msuIconHTML = (await response.text()).trim();
}

function linkAttrs(link) {
  return link.external ? ' target="_blank"' : '';
}

function renderLinkGroup(groupName) {
  const links = linkGroups[groupName] || [];
  return links.map((link, index) => {
    const separator = index < links.length - 1 ? '<span class="sep">/</span>' : '';
    return `
      <a href="${link.href}"${linkAttrs(link)}>
        ${linkIcon(link)}${link.label}
      </a>
      ${separator}
    `;
  }).join('');
}

function renderProfileLinks() {
  document.querySelectorAll('[data-link-group]').forEach((element) => {
    const groupName = element.dataset.linkGroup;
    element.innerHTML = renderLinkGroup(groupName);
  });
}

function fixBlankLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    link.setAttribute('rel', Array.from(rel).join(' '));
  });
}

async function includeHTML() {
  const includeTargets = Array.from(document.querySelectorAll('[data-include]'));

  for (const target of includeTargets) {
    const path = target.getAttribute('data-include');
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load include: ${path}`);
    }
    const html = await response.text();
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    target.replaceWith(template.content.cloneNode(true));
  }
}

function scrollToInitialHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (target) {
    target.scrollIntoView();
  }
}

async function init() {
  try {
    await includeHTML();
    await loadMSUIcon();
    renderProfileLinks();
    fixBlankLinks();
    scrollToInitialHash();
    renderProfileLinks();
    fixBlankLinks();
    scrollToInitialHash();
    if (window.MathJax) {
      await MathJax.typesetPromise();
    }
  } catch (error) {
    console.error(error);
    const page = document.querySelector('.page');
    if (page) {
      page.innerHTML = `
        <p><strong>Failed to render page.</strong></p>
        <p>This usually means the site was opened directly instead of being served over http, or one of the partial files could not be loaded.</p>
        <pre>${error.message}</pre>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', init);