

document.getElementById('csvFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;
        const scores = data.map(row => parseFloat(row.Score)).filter(score => !isNaN(score));
        if (scores.length === 0) return;
        displayTopStudents(data);
        displayStats(scores);
        drawChart(scores);
        document.getElementById('chartType').addEventListener('change', function () {
            drawChart(scores); // Re-render chart with selected type
          });
        
      }
    });
  });
  
  function displayStats(scores) {
    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    const sorted = [...scores].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = (sorted.length % 2 === 0)
      ? ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2)
      : sorted[mid].toFixed(2);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
  
    document.getElementById('avg').textContent = avg;
    document.getElementById('median').textContent = median;
    document.getElementById('highest').textContent = highest;
    document.getElementById('lowest').textContent = lowest;
  }
  /* select bar or pie chart */
  function drawChart(scores) {
    const distribution = {
      'A (90-100)': 0,
      'B (80-89)': 0,
      'C (70-79)': 0,
      'D (60-69)': 0,
      'F (<60)': 0
    };
  
    scores.forEach(score => {
      if (score >= 90) distribution['A (90-100)']++;
      else if (score >= 80) distribution['B (80-89)']++;
      else if (score >= 70) distribution['C (70-79)']++;
      else if (score >= 60) distribution['D (60-69)']++;
      else distribution['F (<60)']++;
    });
  
    const total = scores.length;
    const ctx = document.getElementById('gradeChart').getContext('2d');
    const chartType = document.getElementById('chartType').value;
  
    if (window.gradeChart instanceof Chart) {
      window.gradeChart.destroy();
    }
  
    const config = {
      type: chartType,
      data: {
        labels: Object.keys(distribution),
        datasets: [{
          label: 'Number of Students',
          data: Object.values(distribution),
          backgroundColor: [
            '#4caf50', '#2196f3', '#ffeb3b', '#ff9800', '#f44336'
          ],
          borderColor: '#333',
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
       /* maintainAspectRatio: false, // allow height to grow */
        plugins: {
          title: {
            display: true,
            text: `Grade Distribution (${chartType.toUpperCase()})`,
            font: {
              size: 18
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} students (${percentage}%)`;
              }
            }
          },
          legend: {
            display: true,
            position: chartType === 'pie' ? 'right' : 'top'
          }
        },
        scales: chartType === 'bar' ? {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Students'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Grade Ranges'
            }
          }
        } : {}
      }
    };
  
    window.gradeChart = new Chart(ctx, config);
  }
  
  /* bar chart
  function drawChart(scores) {
    const distribution = {
      'A (90-100)': 0,
      'B (80-89)': 0,
      'C (70-79)': 0,
      'D (60-69)': 0,
      'F (<60)': 0
    };
  
    scores.forEach(score => {
      if (score >= 90) distribution['A (90-100)']++;
      else if (score >= 80) distribution['B (80-89)']++;
      else if (score >= 70) distribution['C (70-79)']++;
      else if (score >= 60) distribution['D (60-69)']++;
      else distribution['F (<60)']++;
    });
  
    const ctx = document.getElementById('gradeChart').getContext('2d');
    if (window.gradeChart instanceof Chart) {
        window.gradeChart.destroy();
      }
      
    window.gradeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(distribution),
        datasets: [{
          label: 'Number of Students',
          data: Object.values(distribution),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
    */
  function displayTopStudents(data) {
    const sorted = data
      .map(row => ({ name: row.Name, score: parseFloat(row.Score) }))
      .filter(entry => !isNaN(entry.score))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  
    const tbody = document.querySelector('#topStudentsTable tbody');
    tbody.innerHTML = ''; // Clear any existing rows
  
    sorted.forEach((student, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.score}</td>
      `;
      tbody.appendChild(row);
    });
}
  
