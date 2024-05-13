import { Button, ButtonSpinner, FormControl, Grid, GridItem, Input, Textarea, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Box, useDisclosure, Stack, IconButton, Image } from "@chakra-ui/react";
import { Fragment, useState, useRef } from "react";
import { usePostThread } from "../hooks/useThread";
import { CloseIcon } from "@chakra-ui/icons";

//icons
import { RiImageAddFill } from "react-icons/ri";

interface CustomFile extends File {
  preview: string;
}

export default function ThreadFrom() {
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isPending } = usePostThread(() => {
    setContent("");
    setImages([]);
  });

  const postThread = () => {
    const thread: ThreadPostType = {
      content,
      images: images.map(({ file, preview }) => {
        const cloneFile: CustomFile = new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        }) as CustomFile;
        cloneFile.preview = preview;
        return cloneFile;
      }),
    };
    mutate(thread);
  };

  const textareaStyle = {
    backgroundImage: `url("https://media.istockphoto.com/id/1148387720/photo/background-from-white-paper-texture-bright-exclusive-background-pattern-close-up.webp?b=1&s=170667a&w=0&k=20&c=0N98FwrU05qkxSBOGHvWpl1DKeMEGHnAwUgy9Vqx8zM=")`,
    backgroundSize: "cover",
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      Promise.all(
        filesArray.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({ file, preview: event.target?.result as string });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
          });
        })
      ).then((threadPhoto) => {
        setImages((prevImages: { file: File; preview: string }[]) => [...prevImages, ...threadPhoto] as { file: File; preview: string }[]);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Fragment>
      <Grid>
        <GridItem>
          <FormControl>
            <Textarea
              style={textareaStyle}
              resize={"none"}
              w="100%"
              placeholder="Let's post new thread!"
              value={content}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
              id="insertThread"
              borderRadius={"15"}
              color={"black"}
            />
          </FormControl>
          <Stack direction={["column", "row"]} spacing={"24px"} overflow={"auto"}>
            {images.map((threadPhoto, i) => (
              <Box key={i} position={"relative"}>
                <Image src={threadPhoto.preview} alt={`${threadPhoto.preview}@${i}`} boxSize="150px" objectFit="cover" borderRadius={"lg"} />

                <IconButton aria-label="Delete Image" icon={<CloseIcon />} onClick={() => handleRemoveImage(i)} position={"absolute"} top={1} right={1} zIndex={1} size={"xs"} borderRadius={"full"} colorScheme="blackAlpha" />
              </Box>
            ))}
          </Stack>
          <Grid templateColumns="repeat(5, 1fr)" gap={4} mt={4}>
            <GridItem colSpan={2} h="10">
              <Box fontSize={"3xl"} color={"#38a169"} cursor={"pointer"} onClick={handleAvatarClick}>
                <RiImageAddFill />
              </Box>
              <Input type="file" name="images" multiple onChange={handleFileChange} style={{ display: "none" }} ref={fileInputRef} />
            </GridItem>
            <GridItem colStart={6} colEnd={6} h="10">
              {isPending ? (
                <Button px={"70px"} colorScheme="green" borderRadius={"full"}>
                  <ButtonSpinner />
                </Button>
              ) : (
                <Button px={"70px"} colorScheme="green" borderRadius={"full"} onClick={postThread}>
                  Post
                </Button>
              )}
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>

      <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom" size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type="file" name="image" onChange={handleFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
