import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Skin {
  id: string;
  name: string;
}

@Component({
  selector: 'app-index',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {
  skins: Skin[] = [];
  filteredSkins: Skin[] = [];
  displayedSkins: Skin[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMsg: string = '';

  pageSize = 20;
  currentPage = 0;
  totalPages = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Skin[]>('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json')
      .subscribe({
        next: (data) => {
          this.skins = data;
          this.filteredSkins = data;
          this.totalPages = Math.ceil(data.length / this.pageSize);
          this.updatePage();
          this.isLoading = false;
        },
        error: () => {
          this.errorMsg = 'Error al cargar las skins.';
          this.isLoading = false;
        }
      });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredSkins = term
      ? this.skins.filter(s => s.name.toLowerCase().includes(term))
      : [...this.skins];
    this.currentPage = 0;
    this.totalPages = Math.ceil(this.filteredSkins.length / this.pageSize);
    this.updatePage();
  }

  updatePage() {
    const start = this.currentPage * this.pageSize;
    this.displayedSkins = this.filteredSkins.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePage();
    }
  }
}
