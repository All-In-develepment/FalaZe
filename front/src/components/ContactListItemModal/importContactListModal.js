import React, { useState, useEffect, useReducer, useContext } from "react";

import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";

import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_CONTACTS") {
    const contacts = action.payload;
    const newContacts = [];

    contacts.forEach((contact) => {
      const contactIndex = state.findIndex((c) => c.id === contact.id);
      if (contactIndex !== -1) {
        state[contactIndex] = contact;
      } else {
        newContacts.push(contact);
      }
    });

    return [...state, ...newContacts];
  }

  if (action.type === "UPDATE_CONTACTS") {
    const contact = action.payload;
    const contactIndex = state.findIndex((c) => c.id === contact.id);

    if (contactIndex !== -1) {
      state[contactIndex] = contact;
      return [...state];
    } else {
      return [contact, ...state];
    }
  }

  if (action.type === "DELETE_CONTACT") {
    const contactId = action.payload;

    const contactIndex = state.findIndex((c) => c.id === contactId);
    if (contactIndex !== -1) {
      state.splice(contactIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

export const ImportContactListModal = ({ open, onClose, updateContacts }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(268);
  const [searchParam, setSearchParam] = useState("");
  const [contacts, dispatch] = useReducer(reducer, []);
  const [hasMore, setHasMore] = useState(false);

  const [selectedContacts, setSelectedContacts] = useState([]);

  const [selectAll, setSelectAll] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const { contactListId } = useParams();
  const {
    user: { companyId },
  } = useContext(AuthContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    if (open !== true) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get("/contacts/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_CONTACTS", payload: data.contacts });
          if (selectAll) {
            setSelectedRows((prevRows) => [
              ...prevRows,
              ...data.contacts.map((contact) => contact.id),
            ]);
          }
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleClose = () => {
    onClose();
    setSelectedRows([]);
    setSelectAll(false);
    setSearchParam("");
    setLoading(false);
  };

  const handleCheckboxChange = (contact) => {
    if (selectedRows.includes(contact.id)) {
      setSelectedRows(selectedRows.filter((id) => id !== contact.id));
    } else {
      setSelectedRows([...selectedRows, contact.id]);
    }

    const isSelected = selectedContacts.some((c) => c.id === contact.id);

    if (isSelected) {
      // Remove o contato se já estiver selecionado
      setSelectedContacts((prevContacts) =>
        prevContacts.filter((c) => c.id !== contact.id)
      );
    } else {
      // Adiciona o contato se ainda não estiver selecionado
      setSelectedContacts((prevContacts) => [...prevContacts, contact]);
    }
  };

  const handleImportButton = async () => {
    if (selectedContacts.length !== 0) {
      const contacts = selectedContacts.map((contact) => {
        const values = {
          name: contact.name,
          number: contact.number,
          email: contact.email,
          companyId,
          contactListId,
        };
        return values;
      });

      try {
        setLoading(true);
        const { data } = await api.post("/contact-list-items-db", contacts);

        handleClose();
        toast.success(i18n.t("contactModal.success"));

        updateContacts(data);
      } catch (error) {
        toastError(error);
      }
    } else toast.warn("Por favor, selecione algum contato.");
  };

  const handleSelectAllCheckboxChange = async () => {
    setSelectAll(!selectAll);

    const updatedSelectedRows = selectAll
      ? []
      : contacts.map((contact) => contact.id);

    const { data } = await api.get("/contacts/", {
      params: { pageNumber: "0" },
    });

    setSelectedRows(updatedSelectedRows);

    setSelectedContacts(data.contacts);
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Contatos</DialogTitle>
      <DialogContent onScroll={handleScroll}>
        <TextField
          placeholder={i18n.t("contacts.searchPlaceholder")}
          type="search"
          value={searchParam}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />
        <Paper className={classes.mainPaper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>{i18n.t("contacts.table.name")}</TableCell>
                <TableCell align="center">
                  {i18n.t("contacts.table.whatsapp")}
                </TableCell>
                {/* <TableCell align="center">
                  {i18n.t("contacts.table.email")}
                </TableCell> */}
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllCheckboxChange}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell style={{ paddingRight: 0 }}>
                      {<Avatar src={contact.profilePicUrl} />}
                    </TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell align="center">{contact.number}</TableCell>
                    {/* <TableCell align="center">{contact.email}</TableCell> */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(contact.id)}
                        onChange={() => handleCheckboxChange(contact)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {loading && <TableRowSkeleton avatar columns={3} />}
              </>
            </TableBody>
          </Table>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleImportButton}>
          Importar
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
