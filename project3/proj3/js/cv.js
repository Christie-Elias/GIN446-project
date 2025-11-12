document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cvForm");
  const preview = document.getElementById("cvPreview");
  const formMessage = document.getElementById("formMessage");


  function createEducation() {
    const div = document.createElement("div");
    div.className = "edu-item";
    div.innerHTML = `
      <input type="text" placeholder="Degree" class="degree" required>
      <input type="text" placeholder="Institution" class="institution" required>
      <input type="text" placeholder="Years (e.g. 2023 - Present)" class="eduYears" required>
      <button type="button" class="remove-btn"><i class="fas fa-trash"></i> Remove</button>
    `;
    div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
    return div;
  }

  function createSkill() {
    const div = document.createElement("div");
    div.className = "skill-item";
    div.innerHTML = `
      <input type="text" placeholder="Skill (e.g. HTML, JavaScript)" class="skill" required>
      <input type="text" placeholder="Category (e.g. Web Development)" class="skill-category-input" required>
      <button type="button" class="remove-btn"><i class="fas fa-trash"></i> Remove</button>
    `;
    div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
    return div;
  }

  function createLanguage() {
    const div = document.createElement("div");
    div.className = "language-item";
    div.innerHTML = `
      <input type="text" placeholder="Language" class="language" required>
      <input type="text" placeholder="Proficiency (e.g. Fluent)" class="proficiency" required>
      <button type="button" class="remove-btn"><i class="fas fa-trash"></i> Remove</button>
    `;
    div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
    return div;
  }

  function createJob() {
    const div = document.createElement("div");
    div.className = "job-item";
    div.innerHTML = `
      <input type="text" placeholder="Job Title" class="jobTitle">
      <input type="text" placeholder="Company" class="company">
      <input type="text" placeholder="Years" class="jobYears">
      <textarea placeholder="Responsibilities" class="jobDesc"></textarea>
      <button type="button" class="remove-btn"><i class="fas fa-trash"></i> Remove</button>
    `;
    div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
    return div;
  }

  function createProject() {
    const div = document.createElement("div");
    div.className = "project-item";
    div.innerHTML = `
      <input type="text" placeholder="Project Title" class="projectTitle">
      <textarea placeholder="Description" class="projectDesc"></textarea>
      <button type="button" class="remove-btn"><i class="fas fa-trash"></i> Remove</button>
    `;
    div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
    return div;
  }

  // Add buttons
  window.addEducation = () => document.getElementById("educationList").appendChild(createEducation());
  window.addSkill = () => document.getElementById("skillsList").appendChild(createSkill());
  window.addLanguage = () => document.getElementById("languagesList").appendChild(createLanguage());
  window.addJob = () => document.getElementById("jobsList").appendChild(createJob());
  window.addProject = () => document.getElementById("projectsList").appendChild(createProject());

  // Toggle sections
  window.toggleJobs = () => {
    document.getElementById("jobsSection").style.display = document.getElementById("includeJobs").checked ? "block" : "none";
  };
  window.toggleProjects = () => {
    document.getElementById("projectsSection").style.display = document.getElementById("includeProjects").checked ? "block" : "none";
  };

  // PROFILE PICTURE UPLOAD 
  let profilePicData = "";
  const profileInput = document.getElementById("profilePicInput");
  if (profileInput) {
    profileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => (profilePicData = reader.result);
        reader.readAsDataURL(file);
      }
    });
  }

  //  TAG INPUTS 
  function setupTagInput(inputId, containerId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && input.value.trim() !== "") {
        e.preventDefault();
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.innerHTML = `${input.value.trim()} <button type="button">×</button>`;
        tag.querySelector("button").onclick = () => tag.remove();
        container.appendChild(tag);
        input.value = "";
      }
    });
  }
  setupTagInput("softSkillInput", "softSkillsTags");
  setupTagInput("interestInput", "interestsTags");

  //  VALIDATION 
  function isValidEmail(email) {
    const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return pattern.test(email);
  }
  function isValidPhone(phone) {
    const pattern = /^\+?[0-9]{7,15}$/;
    return pattern.test(phone);
  }
// RESET BACKGROUND AND TEXT COLOR ON TYPING
const allFields = form.querySelectorAll("input, textarea");
allFields.forEach(field => {
  field.addEventListener("input", () => {
    if (field.value.trim() !== "") {
      field.style.backgroundColor = "#fff"; 
      field.style.color = "#000";           
    } else {
      field.style.backgroundColor = "";  
      field.style.color = "";           
    }
  });
});

  // FORM SUBMIT 
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formMessage.textContent = "";

    let valid = true;
    const required = form.querySelectorAll("[required]");
    required.forEach(f => {
      if (!f.value.trim()) {
        f.style.border = "2px solid #b23a48";
        valid = false;
      } else {
        f.style.border = "1px solid var(--accent-hover)";
      }
    });

    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    if (!isValidEmail(email)) {
      form.email.style.border = "2px solid #b23a48";
      formMessage.textContent = "⚠️ Please enter a valid email address.";
      valid = false;
    } else if (!isValidPhone(phone)) {
      form.phone.style.border = "2px solid #b23a48";
      formMessage.textContent = "⚠️ Please enter a valid phone number (7-15 digits).";
      valid = false;
    }
    if (!valid) {
      if (!formMessage.textContent)
        formMessage.textContent = "⚠️ Please fill all required fields before generating your CV.";
      return;
    }

    // COLLECT DATA 
    const data = {
      fullName: form.fullName.value,
      tagline: form.tagline.value,
      about: form.aboutMe.value,
      email,
      phone,
      location: form.location.value,
      linkedin: form.linkedin.value,
      github: form.github.value,
      profilePic: profilePicData,
      skills: [...form.querySelectorAll(".skill-item")].map(s => ({
        name: s.querySelector(".skill").value.trim(),
        category: s.querySelector(".skill-category-input").value.trim()
      })),
      languages: [...form.querySelectorAll(".language-item")].map(l => ({
        lang: l.querySelector(".language").value,
        prof: l.querySelector(".proficiency").value,
      })),
      education: [...form.querySelectorAll(".edu-item")].map(e => ({
        degree: e.querySelector(".degree").value,
        institution: e.querySelector(".institution").value,
        years: e.querySelector(".eduYears").value,
      })),
      jobs: document.getElementById("includeJobs").checked
        ? [...form.querySelectorAll(".job-item")].map(j => ({
            title: j.querySelector(".jobTitle").value,
            company: j.querySelector(".company").value,
            years: j.querySelector(".jobYears").value,
            desc: j.querySelector(".jobDesc").value,
          }))
        : [],
      projects: document.getElementById("includeProjects").checked
        ? [...form.querySelectorAll(".project-item")].map(p => ({
            title: p.querySelector(".projectTitle").value,
            desc: p.querySelector(".projectDesc").value,
          }))
        : [],
      softSkills: [...form.querySelectorAll("#softSkillsTags .tag")].map(t => t.textContent.replace("×","").trim()),
      interests: [...form.querySelectorAll("#interestsTags .tag")].map(t => t.textContent.replace("×","").trim()),
    };

    // GENERATE CV PREVIEW
    preview.innerHTML = `
     <style>
    #cvPreview {
      background: #e9dfdfff;
      padding: 20px;
      height: 100%;
      overflow: auto;
    }
    .cv-main {
      max-width: 100%;
      margin: 0 auto;
      font-size: 0.9em;
      padding: 20px;
    }
    .cv-wrapper {
      transform: scale(0.92);
      transform-origin: top center;
      width: 100%;
      max-width: 100%;
    }
    .cv-section {
      margin-bottom: 15px;
    }
    .cv-right h3, .cv-right p {
      margin: 5px 0;
      max-width: 100%;
    }
    .cv-right .cv-section {
      padding-right: 20px;
    }
    .cv-header {
      margin-bottom: 20px;
      text-align: center;
    }
    .cv-header h1 {
      margin-bottom: 5px;
    }
    .skill-item, .language-item, .education-item, .job-item, .project-item {
      margin-bottom: 10px;
    }
    .contact-list {
      list-style: none;
      padding: 0;
    }
    .contact-list li {
      margin-bottom: 5px;
    }
    .contact-list i {
      width: 20px;
      margin-right: 10px;
    }
   

  </style>
      <div class="cv-main">
        <div class="cv-wrapper">
          <div class="cv-header">
            <h1>${data.fullName}</h1>
            <p class="tagline">${data.tagline}</p>
          </div>

          <div class="cv-grid">
<!-- LEFT SIDE -->
<div class="cv-left">
  ${data.profilePic ? `
  <div class="cv-section profile-section">
    <img src="${data.profilePic}" alt="Profile Picture" class="profile-image">
    <h2 class="profile-name">${data.fullName}</h2>
  </div>
  ` : ''}  <!-- If no profilePic, this whole section is omitted -->

  <div class="cv-section">
    <h2><i class="fas fa-address-card"></i> Contact</h2>
    <ul class="contact-list">
      <li><i class="fas fa-envelope"></i> ${data.email}</li>
      <li><i class="fas fa-phone"></i> ${data.phone}</li>
      <li><i class="fas fa-map-marker-alt"></i> ${data.location}</li>
      ${data.linkedin ? `<li><i class="fab fa-linkedin"></i> <a href="${data.linkedin}" target="_blank">${data.linkedin}</a></li>` : ""}
      ${data.github ? `<li><i class="fab fa-github"></i> <a href="${data.github}" target="_blank">${data.github}</a></li>` : ""}
    </ul>
  </div>

  <div class="cv-section">
    <h2><i class="fas fa-code"></i> Technical Skills</h2>
    <div class="skills-categories">
      ${data.skills.map(s => `
        <div class="skill-category">
          <h3><i class="fas fa-terminal"></i> ${s.category}</h3>
          <p>${s.name}</p>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="cv-section">
    <h2><i class="fas fa-language"></i> Languages</h2>
    ${data.languages.map(l => `
      <div class="language-item">
        <div class="language-name">${l.lang}</div>
        <div class="language-level">${l.prof}</div>
      </div>
    `).join('')}
  </div>
</div>

            <!-- RIGHT SIDE -->
            <div class="cv-right">
              <div class="cv-section">
                <h2><i class="fas fa-user"></i> About Me</h2>
                <p>${data.about}</p>
              </div>

              <div class="cv-section">
                <h2><i class="fas fa-graduation-cap"></i> Education</h2>
                ${data.education.map(e => `
                  <div class="education-item">
                    <h3>${e.degree}</h3>
                    <p>${e.institution}</p>
                    <p>${e.years}</p>
                  </div>
                `).join('')}
              </div>

              ${data.jobs.length ? `
              <div class="cv-section">
                <h2><i class="fas fa-briefcase"></i> Work Experience</h2>
                ${data.jobs.map(j => `
                  <div class="job-item">
                    <h3>${j.title}</h3>
                    <p>${j.company}</p>
                    <p>${j.years}</p>
                    <p>${j.desc}</p>
                  </div>
                `).join('')}
              </div>` : ''}

              ${data.projects.length ? `
              <div class="cv-section">
                <h2><i class="fas fa-project-diagram"></i> Projects</h2>
                ${data.projects.map(p => `
                  <div class="project-item">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                  </div>
                `).join('')}
              </div>` : ''}

              <div class="cv-section">
                <h2><i class="fas fa-star"></i> Soft Skills</h2>
                <ul class="interests-list">
                  ${data.softSkills.map(skill => `<li class="interest-tag">${skill}</li>`).join('')}
                </ul>
              </div>

              <div class="cv-section">
                <h2><i class="fas fa-heart"></i> Interests</h2>
                <ul class="interests-list">
                  ${data.interests.map(interest => `<li class="interest-tag">${interest}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
});

