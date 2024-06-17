import React, { useEffect, useState } from "react";
import data from "../data/dummy.js";
import {
    Box,
    Container,
    Grid,
    Paper,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

const Filter_Page = () => {
    const keys = data.map((item) => Object.keys(item)).flat(Infinity);
    const allKeys = keys.filter((item, index) => keys.indexOf(item) === index);
    const [table_data, setTable_Data] = useState(data);
    const [filter_input, setFilter_Input] = useState(
        allKeys.filter((_, index) => index > 0).reduce((obj, key) => {
            obj[key] = '';
            return obj;
        }, {}));

    const Get_All_Items_Array = (item_key) => {
        const ITEM = data.map((item) => item[item_key]);
        const ITEM_ARRAY = ITEM.filter((item, index) => ITEM.indexOf(item) === index);
        const ITEM_ARR = ITEM_ARRAY.filter((item) => item !== undefined);
        return ITEM_ARR;
    }

    useEffect(() => {
        const matchesFilter = (item, filter) => {
            return Object.keys(filter).filter(key => filter_input[key].length > 0).every(key => {
                if (Array.isArray(filter[key])) {
                    if (!filter[key].some(value => item[key] === value)) {
                        return false;
                    }
                } else if (typeof filter[key] === 'string') {
                    const regexPattern = new RegExp(filter_input[key], 'i');
                    if (!regexPattern.test(item[key])) {
                        return false;
                    }
                } else {
                    return true;
                }
                return true;
            });
        };
        const filteredData = data.filter(item => matchesFilter(item, filter_input));
        setTable_Data(filteredData);
    }, [filter_input]);

    return (
        <>
            <Container maxWidth="lg">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container gap={5} my={1}>
                        {allKeys.filter((_, index) => index > 1).map((item, key) => (
                            <Grid item xs={2} key={key}>
                                <Stack
                                    gap={2}
                                    display={"flex"}
                                    direction={"row"}
                                    justifyContent={"space-evenly"}
                                    alignItems={"center"}
                                >
                                    <Stack>
                                        <Typography>{item?.charAt(0)?.toUpperCase() + item?.slice(1)}</Typography>
                                    </Stack>
                                    <Stack>
                                        {Get_All_Items_Array(item).map((ele, index) => (
                                            <Box key={index} display={"flex"} alignItems={"center"} gap={1}>
                                                <Switch
                                                    value={ele}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilter_Input((pre) => ({ ...pre, [item]: [...pre[item], e.target.value] }));
                                                        } else {
                                                            setFilter_Input((pre) => ({ ...pre, [item]: pre[item]?.filter((item) => item !== e.target.value) }));
                                                        }
                                                    }}
                                                />{" "}
                                                {ele}
                                            </Box>
                                        ))}
                                    </Stack>
                                </Stack>
                            </Grid>
                        ))}
                        <Grid item xs={2}>
                            <Stack
                                gap={2}
                                display={"flex"}
                                direction={"row"}
                                justifyContent={"space-evenly"}
                                alignItems={"center"}
                                height={"100%"}
                            >
                                <TextField
                                    value={filter_input[allKeys?.filter((_, index) => index === 1)[0]]}
                                    onChange={(e) => setFilter_Input((pre) => ({ ...pre, [allKeys?.filter((_, index) => index === 1)[0]]: e.target.value?.trimStart() }))}
                                    id="standard-basic"
                                    placeholder="Name"
                                    variant="standard"
                                />
                                {JSON.stringify()}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            {allKeys?.map((item, key) => (
                                                <TableCell key={key}>{item}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {table_data?.map((row, index) => (
                                            <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                {allKeys?.map((item, key) => (
                                                    <TableCell key={key}>{row[item] ?? "-"}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                        {(table_data?.length <= 0) && (
                                            <TableRow>
                                                <TableCell colSpan={10} sx={{ textAlign: "center" }}>{"No Records Found."}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default Filter_Page;
