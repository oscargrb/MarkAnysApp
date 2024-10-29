import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  TextInput,
  View,
  Text,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedCard } from "./Card";
import {
  SearchIcons,
  CloseIcon,
  LeftIcon,
  RightIcon,
} from "../Components/Icons";

import Screen from "./Screen";

export default function Main() {
  const insets = useSafeAreaInsets();

  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(60);
  const [filter, setFilter] = useState("");
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    getPokemons();
  }, [offset]);

  const getPokemons = async () => {
    const find = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
      {
        headers: "GET",
      },
    );

    const results = await find.json();

    const save = results.results.map((i) => {
      const arr = i.url.split("/");
      return {
        name: i.name,
        url: i.url,
        id: arr[arr.length - 2],
      };
    });

    setPokemons(save);
  };

  const findByName = async () => {
    setFilterActive(true);
    try {
      const find = await fetch(`https://pokeapi.co/api/v2/pokemon/${filter}`);
      const results = await find.json();

      setPokemons([
        {
          id: results.id,
          name: results.name,
          url: results.url,
        },
      ]);
    } catch (e) {
      alert("Cant found!");
      setFilter("");
      getPokemons();
    }
  };

  return (
    <Screen>
      <View className="flex-row gap-5 justify-center items-center mb-2">
        <TextInput
          placeholder="Buscar Pokemon"
          placeholderTextColor={"white"}
          value={filter}
          className="border-white border-2 h-10 rounded-lg w-1/2 text-white pl-2"
          onChangeText={(text) => {
            setFilter(text.trim().toLocaleLowerCase());
          }}
        />
        {filterActive ? (
          <Pressable
            onPress={() => {
              setFilter("");
              setFilterActive(false);
              getPokemons();
            }}
          >
            <CloseIcon color="white" />
          </Pressable>
        ) : (
          <Pressable onPress={findByName}>
            <SearchIcons color="white" />
          </Pressable>
        )}
      </View>
      {pokemons.length === 0 ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <>
          <FlatList
            data={pokemons.filter((i) => i.name.includes(filter))}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <AnimatedCard item={item} index={index} />
            )}
          />
        </>
      )}
      <View className="flex-row justify-center p-5">
        {offset > 0 ? (
          <Pressable onPress={() => setOffset(offset - limit)}>
            <LeftIcon color={"white"} size={40} />
          </Pressable>
        ) : (
          <></>
        )}
        {offset < 1302 ? (
          <Pressable onPress={() => setOffset(offset + limit)}>
            <RightIcon color={"white"} size={40} />
          </Pressable>
        ) : (
          <></>
        )}
      </View>
    </Screen>
  );
}
