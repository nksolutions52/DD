package com.dentalcare.dto;

public class PageRequest {
    private int page = 0; // 0-based page index
    private int size = 10; // default page size
    private String sortBy = "id";
    private String sortDirection = "asc";
    private String search = "";

    public PageRequest() {}

    public PageRequest(int page, int size) {
        this.page = page;
        this.size = size;
    }

    public PageRequest(int page, int size, String sortBy, String sortDirection) {
        this.page = page;
        this.size = size;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }

    // Getters and setters
    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = Math.max(0, page);
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = Math.min(Math.max(1, size), 100); // Limit max size to 100
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy != null ? sortBy : "id";
    }

    public String getSortDirection() {
        return sortDirection;
    }

    public void setSortDirection(String sortDirection) {
        this.sortDirection = sortDirection != null && sortDirection.equalsIgnoreCase("desc") ? "desc" : "asc";
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search != null ? search : "";
    }

    public org.springframework.data.domain.PageRequest toSpringPageRequest() {
        org.springframework.data.domain.Sort.Direction direction = 
            "desc".equalsIgnoreCase(sortDirection) ? 
            org.springframework.data.domain.Sort.Direction.DESC : 
            org.springframework.data.domain.Sort.Direction.ASC;
        
        return org.springframework.data.domain.PageRequest.of(
            page, 
            size, 
            org.springframework.data.domain.Sort.by(direction, sortBy)
        );
    }
}