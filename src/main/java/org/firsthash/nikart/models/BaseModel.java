package org.firsthash.nikart.models;

import javax.persistence.*;

@MappedSuperclass
public abstract class BaseModel {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long id;

    private String name = this.getClass().getSimpleName(); // cant use id because it is null

    @Column(length = 100*1024) // 100 kb
    private String header = "";

    private int index;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    @Override
    public String toString() {
        String header = this.header.substring(0, Math.min(this.header.length(), 20));
        String res = String.format("{id: %d, name: %s, header: %s, index: %d}", id, name, header, index);
        return res;
    }
}
