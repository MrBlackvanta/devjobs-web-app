export const themeStorageKey = "theme";

export const themeScript = `(function(){try{var stored=localStorage.getItem("${themeStorageKey}");if(stored==="dark"||(stored!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch{}})()`;
