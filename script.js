const input = document.querySelector("input");
const getBtn = document.querySelector("#get-btn");
const thumbsContainer = document.getElementById("thumbnails");

async function downloadImage(url, filename) {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('Network response not ok');
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    window.open(url, '_blank', 'noopener');
  }
}


const extractVideoId = () => {
  const val = input.value.trim();
  if (!val) return;

  if (val.includes("youtu.be/")) {
    const videoId = new URL(val).pathname.slice(1);
    return videoId;
  }

  if (val.includes("youtube.com")) {
    const videoId = new URL(val).searchParams.get("v");
    return videoId;
  }
};

const generateThumbnail = () => {
  const id = extractVideoId();
  const thumbs = {
    HD: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, // 1280x720
    SD: `https://img.youtube.com/vi/${id}/sddefault.jpg`, // 640x480
    "360p": `https://img.youtube.com/vi/${id}/hqdefault.jpg`, // 480x360
    "180p": `https://img.youtube.com/vi/${id}/mqdefault.jpg`, // 320x180
    Low: `https://img.youtube.com/vi/${id}/default.jpg`, // 120x90
  };

  const order = ["HD", "SD", "360p", "180p", "Low"];

  thumbsContainer.innerHTML = "";

  order.forEach((key) => {
    const box = document.createElement("div");
    box.className = "thumbnail-box";

    const img = document.createElement("img");
    img.alt = key;

    img.onload = () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `Download (${key})`;
    btn.addEventListener('click', () => downloadImage(thumbs[key], `${id}-${key}.jpg`));
    box.appendChild(btn);
    };

    img.src = thumbs[key];
    box.appendChild(img);
    thumbsContainer.appendChild(box);
  });
};

getBtn.addEventListener("click", generateThumbnail);
