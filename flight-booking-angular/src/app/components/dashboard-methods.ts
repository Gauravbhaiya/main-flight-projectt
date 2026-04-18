// Add this method to the DashboardComponent class

goToProfile(): void {
  this.router.navigate(['/profile']);
}

// Also update the dropdown profile link to navigate properly
navigateToProfile(): void {
  this.router.navigate(['/profile']);
}