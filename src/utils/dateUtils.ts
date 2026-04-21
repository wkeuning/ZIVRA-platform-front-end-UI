export const formatDate = (dateString: string): string => {
    if (!dateString || dateString === "No recent activity") return dateString;
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
};