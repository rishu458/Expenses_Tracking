package com.example.demo.dto;

public class UserProfileResponse {

    private String name;
    private String email;
    private String address;

    public UserProfileResponse (String name, String email, String address){
        this.name = name;
        this.email = email;
        this.address = address;
    }

    //address
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    //email
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    //name
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
