/**
 * Reward Geni Documentation — Script
 * Handles: theme toggle, sidebar, search, copy-to-clipboard, syntax highlight, code tabs
 */

(function () {
  "use strict";

  /* =============================================
     0. Config — Replace BASE_URL across all pages
     ============================================= */
  // CONFIG is defined in config.js (loaded before this script)
  // The HTML has the default staging URL baked in.
  // This replaces it with whatever CONFIG.BASE_URL says.
  if (typeof CONFIG !== "undefined") {
    var defaultUrl = "https://your-api.example.com";

    document.querySelectorAll("[data-config-site-name]").forEach(function (el) {
      el.textContent = CONFIG.SITE_NAME || "Reward Geni Hybrid Client API";
    });

    document
      .querySelectorAll("[data-config-api-version]")
      .forEach(function (el) {
        el.textContent = CONFIG.API_VERSION || "v1.0.0";
      });

    document.querySelectorAll("[data-config-base-url]").forEach(function (el) {
      el.textContent = CONFIG.BASE_URL || defaultUrl;
    });

    if (CONFIG.BASE_URL !== defaultUrl) {
      document.querySelectorAll("code, pre").forEach(function (el) {
        el.innerHTML = el.innerHTML.split(defaultUrl).join(CONFIG.BASE_URL);
      });
      document.querySelectorAll("[data-code]").forEach(function (el) {
        var code = el.getAttribute("data-code");
        if (code) {
          el.setAttribute(
            "data-code",
            code.split(defaultUrl).join(CONFIG.BASE_URL),
          );
        }
      });
    }
  }

  /* =============================================
     1a. Dynamic Footer Year
     ============================================= */
  document.querySelectorAll(".footer-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* =============================================
     1. Theme Toggle
     ============================================= */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("rg-theme", theme);
  }

  // Load saved theme or detect system preference
  const saved = localStorage.getItem("rg-theme");
  if (saved) {
    setTheme(saved);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    setTheme("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") || "light";
      setTheme(current === "light" ? "dark" : "light");
    });
  }

  /* =============================================
     2. Sidebar (Mobile)
     ============================================= */
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const sidebarClose = document.getElementById("sidebarClose");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  function openSidebar() {
    if (sidebar) sidebar.classList.add("open");
    if (sidebarOverlay) sidebarOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (menuToggle) menuToggle.addEventListener("click", openSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  document.querySelectorAll(".postman-download").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var fileUrl = btn.getAttribute("data-download-url");
      if (!fileUrl) return;

      var fileName =
        btn.getAttribute("data-download-filename") || "postman_collection.json";

      var link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });

  // Close sidebar when clicking a nav link on mobile
  document.querySelectorAll(".sidebar .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  /* =============================================
     3. Copy to Clipboard
     ============================================= */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".copy-btn");
    if (!btn) return;

    var code = btn.getAttribute("data-code") || "";
    if (!code) {
      var block = btn.closest(".code-block") || btn.closest(".code-tabs");
      if (block) {
        var pre = block.querySelector("pre");
        if (pre) code = pre.textContent;
      }
    }

    navigator.clipboard.writeText(code).then(function () {
      var origHTML = btn.innerHTML;
      btn.classList.add("copied");
      btn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      setTimeout(function () {
        btn.classList.remove("copied");
        btn.innerHTML = origHTML;
      }, 2000);
    });
  });

  /* =============================================
     4. Code Tabs
     ============================================= */
  document.querySelectorAll(".code-tabs").forEach(function (tabs) {
    var buttons = tabs.querySelectorAll(".code-tab-btn");
    var contents = tabs.querySelectorAll(".code-tab-content");

    buttons.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        contents.forEach(function (c) {
          c.classList.remove("active");
        });
        btn.classList.add("active");
        if (contents[i]) contents[i].classList.add("active");
      });
    });
  });

  /* =============================================
     5. Syntax Highlighting (basic)
     ============================================= */
  function highlightJSON(code) {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /("(?:[^"\\]|\\.)*")(\s*:)/g,
        '<span class="token-key">$1</span>$2',
      )
      .replace(
        /:\s*("(?:[^"\\]|\\.)*")/g,
        ': <span class="token-string">$1</span>',
      )
      .replace(/:\s*(\d+(?:\.\d+)?)/g, ': <span class="token-number">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span class="token-boolean">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="token-keyword">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>');
  }

  function highlightCurl(code) {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="token-string">$1</span>')
      .replace(/(https?:\/\/[^\s'"\\]+)/g, '<span class="token-url">$1</span>')
      .replace(/(#.*)/g, '<span class="token-comment">$1</span>');
  }

  function highlightJS(code) {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>')
      .replace(
        /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g,
        '<span class="token-string">$1</span>',
      )
      .replace(
        /\b(const|let|var|function|return|async|await|import|from|try|catch|if|else|new|throw)\b/g,
        '<span class="token-keyword">$1</span>',
      )
      .replace(
        /\b(true|false|null|undefined)\b/g,
        '<span class="token-boolean">$1</span>',
      )
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="token-number">$1</span>');
  }

  // Apply highlighting to all pre>code blocks
  document.querySelectorAll("pre code").forEach(function (block) {
    var raw = block.textContent;
    var lang = "";
    var codeBlock = block.closest(".code-block");
    if (codeBlock) {
      var langEl = codeBlock.querySelector(".code-lang");
      if (langEl) lang = langEl.textContent.trim().toLowerCase();
    }
    if (!lang) {
      // Try to detect from content
      if (raw.trim().startsWith("{") || raw.trim().startsWith("["))
        lang = "json";
      else if (raw.trim().startsWith("curl")) lang = "curl";
      else if (raw.includes("fetch(") || raw.includes("axios"))
        lang = "javascript";
    }

    if (lang === "json") {
      block.innerHTML = highlightJSON(raw);
    } else if (lang === "curl" || lang === "bash" || lang === "shell") {
      block.innerHTML = highlightCurl(raw);
    } else if (
      lang === "javascript" ||
      lang === "js" ||
      lang === "node.js" ||
      lang === "nodejs"
    ) {
      block.innerHTML = highlightJS(raw);
    }
  });

  /* =============================================
     6. Search
     ============================================= */
  var searchInput = document.getElementById("searchInput");
  var searchResults = document.getElementById("searchResults");
  var searchIndex = [];

  // Load search index from the same base as script.js to avoid path issues.
  var searchIndexPath = window.location.pathname;
  var scriptEl = document.querySelector('script[src*="script.js"]');
  var scriptBase = scriptEl
    ? new URL(scriptEl.getAttribute("src"), window.location.href)
    : new URL("script.js", window.location.href);
  var searchIndexUrls = [
    new URL("search-index.json", scriptBase).toString(),
    new URL("search-index.json", window.location.href).toString(),
    new URL("../search-index.json", window.location.href).toString(),
  ];

  function buildLocalSearchIndex() {
    var items = [];
    var main = document.querySelector("main");
    var pageTitleEl = document.querySelector("main h1");
    var pageTitle = pageTitleEl
      ? pageTitleEl.textContent.trim()
      : document.title;
    var pagePath = window.location.pathname.split("/").pop() || "index.html";
    var pageText = main ? main.textContent.replace(/\s+/g, " ").trim() : "";

    if (pageTitle) {
      items.push({
        title: pageTitle,
        section: "Current Page",
        url: pagePath,
        content: pageText,
        keywords: pageTitle,
      });
    }

    document
      .querySelectorAll("main h2[id], main h3[id]")
      .forEach(function (heading) {
        var parent = heading.closest("section") || heading.parentElement;
        var sectionText = parent
          ? parent.textContent.replace(/\s+/g, " ").trim()
          : heading.textContent.trim();

        items.push({
          title: heading.textContent.replace("#", "").trim(),
          section: pageTitle || "Current Page",
          url: pagePath + "#" + heading.id,
          content: sectionText,
          keywords: heading.textContent,
        });
      });

    document.querySelectorAll(".sidebar .nav-link").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var title = link.textContent.trim();
      if (!href || !title) return;

      items.push({
        title: title,
        section: "Navigation",
        url: href,
        content: title,
        keywords: title,
      });
    });

    var seen = {};
    return items.filter(function (item) {
      var key = item.url + "::" + item.title;
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function fetchSearchIndexWithFallback(urls, idx) {
    if (idx >= urls.length) {
      return Promise.reject(new Error("search index not found"));
    }

    return fetch(urls[idx])
      .then(function (r) {
        if (!r.ok) throw new Error("search index not found");
        return r.json();
      })
      .catch(function () {
        return fetchSearchIndexWithFallback(urls, idx + 1);
      });
  }

  function loadSearchIndex() {
    return fetchSearchIndexWithFallback(searchIndexUrls, 0)
      .then(function (data) {
        searchIndex = Array.isArray(data) ? data : [];

        if (searchInput) {
          var q = searchInput.value.trim();
          if (q.length >= 2) doSearch(q);
        }
      })
      .catch(function () {
        searchIndex = buildLocalSearchIndex();
      });
  }

  loadSearchIndex();

  function normalize(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function fuzzyMatch(text, query) {
    var t = normalize(text);
    var q = normalize(query);

    // Direct substring match
    if (t.includes(q)) return true;

    // Word-by-word match: every word in query must appear in text
    var words = q.split(/\s+/).filter(function (w) {
      return w.length > 1;
    });
    if (words.length === 0) return false;

    return words.every(function (word) {
      // Exact word match
      if (t.includes(word)) return true;
      // Singular/plural fuzzy: "user" matches "users" and vice versa
      if (word.endsWith("s") && t.includes(word.slice(0, -1))) return true;
      if (t.includes(word + "s")) return true;
      if (t.includes(word + "es")) return true;
      if (t.includes(word + "ing")) return true;
      if (t.includes(word + "ed")) return true;
      return false;
    });
  }

  function doSearch(query) {
    if (!query || query.length < 2) {
      searchResults.classList.remove("active");
      return;
    }

    var results = searchIndex
      .filter(function (item) {
        return (
          fuzzyMatch(item.title, query) ||
          fuzzyMatch(item.content, query) ||
          (item.keywords && fuzzyMatch(item.keywords, query))
        );
      })
      .slice(0, 10);

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="search-no-results">No results found for "' +
        escapeHtml(query) +
        '"</div>';
    } else {
      searchResults.innerHTML = results
        .map(function (item) {
          var url = item.url;
          if (!url.startsWith("http")) {
            url = new URL(url, scriptBase).toString();
          }
          return (
            '<a href="' +
            url +
            '" class="search-result-item">' +
            '<div class="search-result-title">' +
            escapeHtml(item.title) +
            "</div>" +
            '<div class="search-result-section">' +
            escapeHtml(item.section || "") +
            "</div>" +
            "</a>"
          );
        })
        .join("");
    }

    searchResults.classList.add("active");
  }

  function escapeHtml(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  if (searchInput) {
    var debounce;
    var searchFocusScrollY = null;
    var pendingSearchFocusY = null;
    var isSearchScrollLocked = false;

    function keepSearchScrollStable() {
      if (searchFocusScrollY === null) return;
      if (Math.abs(window.scrollY - searchFocusScrollY) > 1) {
        window.scrollTo(0, searchFocusScrollY);
      }
    }

    function enableSearchScrollLock() {
      if (isSearchScrollLocked) return;
      isSearchScrollLocked = true;
      window.addEventListener("scroll", keepSearchScrollStable, {
        passive: true,
      });
    }

    function disableSearchScrollLock() {
      if (!isSearchScrollLocked) return;
      isSearchScrollLocked = false;
      window.removeEventListener("scroll", keepSearchScrollStable);
    }

    searchInput.addEventListener("pointerdown", function () {
      pendingSearchFocusY = window.scrollY;
    });

    searchInput.addEventListener("touchstart", function () {
      pendingSearchFocusY = window.scrollY;
    });

    searchInput.addEventListener("mousedown", function (e) {
      pendingSearchFocusY = window.scrollY;

      // Prevent browser auto-scroll when focusing via mouse click.
      if (document.activeElement !== searchInput) {
        e.preventDefault();
        try {
          searchInput.focus({ preventScroll: true });
        } catch (err) {
          searchInput.focus();
        }
      }
    });

    searchInput.addEventListener("keydown", function (e) {
      // Keep global keyboard handlers from reacting while typing in search.
      e.stopPropagation();
    });

    searchInput.addEventListener("focus", function () {
      searchFocusScrollY =
        pendingSearchFocusY !== null ? pendingSearchFocusY : window.scrollY;
      pendingSearchFocusY = null;
      enableSearchScrollLock();

      // Ensure focus does not nudge document position.
      requestAnimationFrame(function () {
        if (
          document.activeElement === searchInput &&
          searchFocusScrollY !== null
        ) {
          window.scrollTo(0, searchFocusScrollY);
        }
      });
    });

    searchInput.addEventListener("blur", function () {
      searchFocusScrollY = null;
      disableSearchScrollLock();
    });

    searchInput.addEventListener("input", function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        doSearch(searchInput.value.trim());
      }, 200);
    });

    // Close search on outside click
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search-container")) {
        searchResults.classList.remove("active");
      }
    });

    // Keyboard shortcut: / to focus search
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== searchInput) {
        e.preventDefault();
        pendingSearchFocusY = window.scrollY;
        try {
          searchInput.focus({ preventScroll: true });
        } catch (err) {
          searchInput.focus();
        }
      }
      if (e.key === "Escape") {
        searchResults.classList.remove("active");
        searchInput.blur();
      }
    });
  }

  /* =============================================
     7. Active Nav Link (page + hash aware)
     ============================================= */
  function normalizePath(pathname) {
    if (!pathname) return "";
    return pathname
      .replace(/\/+/g, "/")
      .replace(/\/$/, "")
      .replace(/\.html$/, "");
  }

  function parseHref(href) {
    try {
      var resolved = new URL(href, window.location.href);
      return {
        path: normalizePath(resolved.pathname),
        hash: resolved.hash ? resolved.hash.replace("#", "") : "",
      };
    } catch (err) {
      return { path: "", hash: "" };
    }
  }

  var currentNormalizedPath = normalizePath(window.location.pathname);
  var sidebarNavLinks = Array.prototype.slice.call(
    document.querySelectorAll(".sidebar .nav-link"),
  );

  function clearSidebarActive() {
    sidebarNavLinks.forEach(function (link) {
      link.classList.remove("active");
    });
  }

  function setSidebarActive(link) {
    if (!link) return;
    clearSidebarActive();
    link.classList.add("active");
  }

  function getCurrentPageSidebarLinks() {
    return sidebarNavLinks.filter(function (link) {
      var parsed = parseHref(link.getAttribute("href") || "");
      return parsed.path === currentNormalizedPath;
    });
  }

  function activateSidebarByHash(hash) {
    var pageLinks = getCurrentPageSidebarLinks();
    var cleanHash = (hash || "").replace("#", "");

    if (cleanHash) {
      var hashLink = pageLinks.find(function (link) {
        var parsed = parseHref(link.getAttribute("href") || "");
        return parsed.hash === cleanHash;
      });
      if (hashLink) {
        setSidebarActive(hashLink);
        return true;
      }
    }

    var overviewLink = pageLinks.find(function (link) {
      var parsed = parseHref(link.getAttribute("href") || "");
      return !parsed.hash;
    });
    if (overviewLink) {
      setSidebarActive(overviewLink);
      return true;
    }

    return false;
  }

  activateSidebarByHash(window.location.hash);

  var sidebarHashTargets = getCurrentPageSidebarLinks()
    .map(function (link) {
      var parsed = parseHref(link.getAttribute("href") || "");
      if (!parsed.hash) return null;

      var target = document.getElementById(parsed.hash);
      if (!target) return null;

      return {
        id: parsed.hash,
        link: link,
        el: target,
      };
    })
    .filter(Boolean);

  function updateSidebarFromScroll() {
    if (document.activeElement === searchInput) return;
    if (sidebarHashTargets.length === 0) return;

    var topOffset = 110;
    var scrollPosition = window.scrollY + topOffset;
    var activeTarget = null;

    sidebarHashTargets.forEach(function (entry) {
      if (entry.el.offsetTop <= scrollPosition) {
        activeTarget = entry;
      }
    });

    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4
    ) {
      activeTarget = sidebarHashTargets[sidebarHashTargets.length - 1];
    }

    if (activeTarget) {
      setSidebarActive(activeTarget.link);
      return;
    }

    var overviewLink = getCurrentPageSidebarLinks().find(function (link) {
      var parsed = parseHref(link.getAttribute("href") || "");
      return !parsed.hash;
    });

    if (overviewLink) {
      setSidebarActive(overviewLink);
    }
  }

  window.addEventListener("scroll", updateSidebarFromScroll, { passive: true });
  window.addEventListener("resize", updateSidebarFromScroll);
  window.addEventListener("hashchange", function () {
    activateSidebarByHash(window.location.hash);
  });

  updateSidebarFromScroll();

  /* =============================================
     8. Smooth scroll for anchor links
     ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, null, a.getAttribute("href"));
      }
    });
  });

  /* =============================================
     9. Page Transitions
     ============================================= */
  // Create overlay element
  var overlay = document.createElement("div");
  overlay.className = "page-transition-overlay";
  document.body.appendChild(overlay);

  // Remove fadeInUp animation after initial load to prevent re-trigger
  var mainWrapper = document.querySelector(".main-wrapper");
  if (mainWrapper) {
    mainWrapper.addEventListener("animationend", function () {
      mainWrapper.style.animation = "none";
    });
  }

  // Get current page path (normalized, without hash)
  var currentPath = window.location.pathname
    .replace(/\/$/, "")
    .replace(/\.html$/, "");

  // Intercept internal link clicks for smooth transition
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (!link) return;

    var href = link.getAttribute("href");
    if (!href) return;

    // Skip pure anchors, external links, javascript, new-tab links, and downloads
    if (
      href.startsWith("#") ||
      href.startsWith("javascript") ||
      link.target === "_blank" ||
      link.hasAttribute("download")
    )
      return;
    if (href.startsWith("http") && !href.includes(window.location.hostname))
      return;

    // Check if link points to the SAME page (with or without hash)
    var linkPath = href
      .split("#")[0]
      .replace(/\/$/, "")
      .replace(/\.html$/, "");
    var linkHash = href.includes("#") ? "#" + href.split("#").pop() : "";

    // Resolve relative paths for comparison
    var resolvedLinkPath = linkPath;
    if (!linkPath.startsWith("/")) {
      // Relative path — resolve against current location
      var basePath = window.location.pathname.split("/");
      basePath.pop(); // remove current file
      resolvedLinkPath = (basePath.join("/") + "/" + linkPath)
        .replace(/\/+/g, "/")
        .replace(/\/$/, "")
        .replace(/\.html$/, "");
    } else {
      resolvedLinkPath = linkPath.replace(/\/$/, "").replace(/\.html$/, "");
    }

    var resolvedCurrentPath =
      currentPath ||
      window.location.pathname.replace(/\/$/, "").replace(/\.html$/, "");

    // Same page? → just smooth scroll, no page reload
    if (
      resolvedLinkPath === resolvedCurrentPath ||
      linkPath === "" ||
      linkPath === "."
    ) {
      if (linkHash) {
        var targetEl = document.querySelector(linkHash);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, null, linkHash);
          return;
        }
      }
      // Same page, no hash — do nothing
      return;
    }

    // Different page → smooth fade transition
    e.preventDefault();
    overlay.classList.add("active");

    setTimeout(function () {
      window.location.href = href;
    }, 260);
  });

  /* =============================================
     10. Footer Year (auto)
     ============================================= */
  var footerText = document.querySelector(".footer .footer-content p");
  if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace(
      /\b20\d{2}\b/,
      String(new Date().getFullYear()),
    );
  }
})();
