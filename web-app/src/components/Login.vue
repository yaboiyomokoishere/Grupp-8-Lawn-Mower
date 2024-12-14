<template>
    <h1>Input Type File</h1>
    <form @submit.prevent="registerAnswer">
      <label>Username:
        <input @change="updateVal" type="text">
      </label>
      <label>Password:
        <input @change="updateVal" type="text">
      </label>
      <button type="submit">Submit</button>
    </form>
    <div>
      <h3>Submitted answerp:</h3>
      <p id="pAnswer">{{ inpValSubmitted }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        fileInp: null,
        inpValSubmitted: 'Not submitted yet'
      }
    },
    methods: {
      registerAnswer() {
        if(this.fileInp) {
          this.inpValSubmitted = this.fileInp;
        }
      },
      updateVal(e) {
        this.fileInp = e.target.value;
      }
    }
  }
  </script>
  
  <style scoped>
    div {
      border: dashed black 1px;
      border-radius: 10px;
      padding: 0 20px 20px 20px;
      margin-top: 20px;
      display: inline-block;
    }
    button {
      margin: 10px;
      display: block;
    }
    #pAnswer {
      background-color: gray;
      padding: 5px;
    }
  </style>