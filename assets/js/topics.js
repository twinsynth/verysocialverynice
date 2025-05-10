// This file could be used to dynamically generate topics checkboxes in topics.html

const topics = [
  { id: "mindbenders", name: "Mind Benders" },
  { id: "poptalk", name: "Pop Talk" },
  { id: "wanderlust", name: "Wanderlust" },
  { id: "hottakes", name: "Hot Takes" },
  { id: "forthelols", name: "For the LOLs" }
];

const form = document.getElementById("topics-form");
if (form) {
  topics.forEach(topic => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="topic" value="${topic.id}" checked /> ${topic.name}`;
    form.appendChild(label);
    form.appendChild(document.createElement("br"));
  });
}

