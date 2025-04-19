export default class Alert {
    constructor(jsonPath) {
      this.jsonPath = jsonPath;
    }
  
    // async fetchAlerts() {
    //   try {
    //     const response = await fetch(this.jsonPath);
    //     if (!response.ok) throw new Error("Failed to load alerts");
    //     return await response.json();
    //   } catch (error) {
    //     console.error("Error fetching alerts from:", this.jsonPath, error);
    //     return [];
    //   }
    // }

    async fetchAlerts() {
      try {
        console.log("Fetching alerts from:", this.jsonPath); 
        const response = await fetch(this.jsonPath);
        
        // Log the response status and content type
        console.log("Response status:", response.status);
        console.log("Response content type:", response.headers.get("Content-Type"));
    
        if (!response.ok) throw new Error(`Failed to load alerts (Status: ${response.status})`);
        
        const data = await response.json(); // This line throws an error if it's not JSON
        console.log("Fetched alerts data:", data);
        return data;
      } catch (error) {
        console.error("Error fetching alerts from:", this.jsonPath, error);
        return [];
      }
    }
  
    
  
    async render() {
      const alerts = await this.fetchAlerts();
      if (alerts.length === 0) return;
  
      const section = document.createElement("section");
      section.classList.add("alert-list");
  
      alerts.forEach(({ message, background, color }) => {
        const p = document.createElement("p");
        p.textContent = message;
        p.style.backgroundColor = background;
        p.style.color = color;
        section.appendChild(p);
      });
  
      document.querySelector("main").prepend(section);
    }
  }
  