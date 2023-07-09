<script setup>
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

const { result, loading, error } = useQuery(GET_USERS);
</script>

<template>
  <h1>GraphQL</h1>
  <div v-if="loading"><p>ローディング中です</p></div>
  <div v-else-if="error">
    <p>エラーが発生しています。</p>
    <p></p>
  </div>
  <div v-else>
    <div v-for="user in result.users" :key="user.id">Name: {{ user.name }}</div>
  </div>
</template>

<style scoped>
</style>
