import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fileActionService } from "../../redux/slices/fileSlice";
import { useSelector } from "react-redux/es/exports";
import { RootState } from "../../redux/store";
import { isInstanceOf, isTypeOf } from "../../misc/functions/isTypeOf";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface IJsonState {
    Version: string;
    Data: {
        GameState: string;
    };
}

interface RenderTree {
    id: string;
    name: string;
    children?: readonly RenderTree[];
}

type Props = {};

const FileMap = (props: Props) => {
    const dispatch = useDispatch();
    const fileState = useSelector((state: RootState) => state.file);

    const [filesTotal, setFilesTotal] = useState<number>(0);
    const [currentFile, setCurrentFile] = useState<number>(0);

    const [treeMap, setTreeMap] = useState<RenderTree[]>();

    const asyncronusFileHandler = async (fileList: FileList, index: number, length: number) => {
        const fileReader = new FileReader();
        const fileName = fileList[index].name.split(".")[0];
        setCurrentFile((currValue) => (index < length ? index + 1 : currValue));

        console.log(fileList[index].type);

        if (fileList[index].type === "image/png") {
            fileReader.readAsDataURL(fileList[index]);
            fileReader.onload = async () => {
                fileReader.result &&
                    dispatch(fileActionService.loadFile({ fileName, info: fileReader.result, isThumbnale: true }));
            };
            return;
        }
        fileReader.readAsText(fileList[index]);
        fileReader.onload = async (e) => {
            const content = e.target?.result;
            content && dispatch(fileActionService.loadFile({ fileName, info: content }));
        };
    };

    const changeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;

        if (files !== null) {
            setFilesTotal(() => files.length);
            setCurrentFile(() => 0);
            let i = 0;
            for (i = 0; i < files.length; i++) {
                const asyncFileHandling = new Promise(() => asyncronusFileHandler(files, i, files.length));
                asyncFileHandling;
            }
        }
    };

    const buildTreeMap = (child: object | string | number): RenderTree[] => {
        if (child === undefined || child === null) return [];
        if (isInstanceOf("object", child)) {
            return Object.entries(child).map(([key, value]) => ({
                id: key,
                name: key,
                children: buildTreeMap(value),
            }));
        }
        return [];
    };

    const renderTree = (nodes: RenderTree) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    useEffect(() => {
        fileState.Data &&
            setTreeMap(() => {
                return fileState.Data
                    ? Object.entries(fileState.Data).map(([key, value]) => {
                          return fileState.Data
                              ? {
                                    id: key,
                                    name: key,
                                    children: buildTreeMap(fileState.Data[key]),
                                }
                              : { id: "null", name: "null" };
                      })
                    : [];
            });
    }, [fileState.Data]);

    return (
        <div>
            <input type="file" name="file" onChange={changeHandler} multiple />
            <div>
                {currentFile} / {filesTotal}
            </div>
            {treeMap && treeMap.length > 0 && (
                <TreeView
                    aria-label="rich object"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={[]}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ height: "fit-content", flexGrow: 1, width: "90vw", overflowY: "auto" }}
                >
                    {treeMap.map((item) => renderTree(item))}
                </TreeView>
            )}
        </div>
    );
};

export default FileMap;
