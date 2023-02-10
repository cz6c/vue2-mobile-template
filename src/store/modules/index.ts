import { VuexModule, Module, Mutation, getModule } from "vuex-module-decorators";
import store from "@/store";
export interface IndexState {
  cache: string[];
}

@Module({ dynamic: true, store, name: "index" })
class Index extends VuexModule implements IndexState {
  cache: string[] = [];
  @Mutation
  public setCache(data: string[]) {
    this.cache = data;
  }
  @Mutation
  public pushCache(name: string) {
    this.cache.push(name);
  }
  @Mutation
  public clearCache() {
    this.cache = [];
  }
}

export const IndexModule = getModule(Index);
