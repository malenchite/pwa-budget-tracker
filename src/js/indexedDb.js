let db;
const request = indexedDB.open("budgettracker", 1);

// Create pending object store on upgrade
request.onupgradeneeded = function (event) {
  db = event.target.result;
  db.createObjectStore("pending", {
    autoIncrement: true
  });
};

// Check database for pending if online
request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

// Error handling
request.onerror = function (event) {
  console.log("Error: " + event.target.errorCode);
};

// Add a pending record to the database
export function saveRecord(record) {
  const transaction = db.transaction("pending", "readwrite");
  const pendingStore = transaction.objectStore("pending");

  pendingStore.add(record);
}

// Check for pending transactions and send to API if present
function checkDatabase() {
  const transaction = db.transaction("pending", "readwrite");
  const pendingStore = transaction.objectStore("pending");
  const getAll = pendingStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction("pending", "readwrite");
          const pendingStore = transaction.objectStore("pending");

          pendingStore.clear();
        });
    }
  };
}

// Listen for online event to check database
window.addEventListener('online', checkDatabase);
