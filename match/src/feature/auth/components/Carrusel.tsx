import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface CarruselItem {
    id: string;
    title: string;
    description: string;
    content: React.ReactNode
}

interface CarruselProps {
    items: CarruselItem[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
}

//const { width } = Dimensions.get('window');

const Carrusel = ({items, currentIndex, onIndexChange}: CarruselProps) => {
    const flatListRef = useRef<FlatList<CarruselItem>>(null);
    
    const [pageWidth, setPageWidth] = useState(0);
    const [pageHeight, setPageHeight] = useState(0);


    useEffect(() => {
        flatListRef.current?.scrollToIndex({
            index: currentIndex,
            animated: true
        });
    }, [currentIndex]);

    const onViewItemCarrusel = useRef(
        ({viewableItems }: any) => {
            if (viewableItems .length > 0) {
                onIndexChange(viewableItems[0].index)
            }
        }
    ).current;

    const viewConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    return (
        <View
            style={{ flex: 1 }}
            onLayout={(event) => {
                setPageWidth(event.nativeEvent.layout.width);
                setPageHeight(event.nativeEvent.layout.height);
            }}
        >
            <FlatList
                data={items}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={{height: pageHeight, width: pageWidth }}>
                        {/* <View style={styles.imagePlaceholder} />
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>
                            {item.description}
                        </Text> */}
                        {item.content}
                    </View>
                )}
                onViewableItemsChanged={onViewItemCarrusel}
                viewabilityConfig={viewConfig}
                ref={flatListRef}
                getItemLayout={(data, index) => ({
                    length: pageWidth,
                    offset: pageWidth * index,
                    index,
                })}
            />
        </View>
    )
}

export default Carrusel

const styles = StyleSheet.create({
//   slide: {
//     width,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 30,
//   },

  imagePlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: 'unset',
    borderRadius: 20,
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  }
});