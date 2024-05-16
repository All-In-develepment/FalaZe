import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useCallback
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from "react-trello";
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from "react-router-dom";
import { socketConnection } from "../../services/socket";
import usePlans from "../../hooks/usePlans";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1)
  },
  button: {
    background: "#10a110",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px"
  }
}));

const Kanban = () => {
  const classes = useStyles();
  const history = useHistory();

  const [tags, setTags] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [tickets, setTickets] = useState([]);
  const { user } = useContext(AuthContext);
  const { profile, queues } = user;
  const jsonString = user.queues.map(queue => queue.UserQueue.queueId);

  const { getPlanCompany } = usePlans();
  const companyId = user.companyId;

  useEffect(() => {
    async function fetchData() {
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useKanban) {
        toast.error(
          "Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando."
        );
        setTimeout(() => {
          history.push(`/`);
        }, 1000);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/kanban");
      const fetchedTags = response.data.lista || [];

      setTags(fetchedTags);

      // Fetch tickets after fetching tags
      await fetchTickets(jsonString);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [file, setFile] = useState({
    lanes: []
  });

  const fetchTickets = async jsonString => {
    try {
      const { data } = await api.get("/ticket/kanban", {
        params: {
          queueIds: JSON.stringify(jsonString),
          teste: true
        }
      });
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  };

  const popularCards = jsonString => {
    const filteredTickets = tickets.filter(ticket => ticket.tags.length === 0);

    const lanes = [
      {
        id: "lane0",
        title: i18n.t("Em aberto"),
        label: "0",
        cards: filteredTickets.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
            <div>
              <p>
                {ticket.contact.number}
                <br />
                {ticket.lastMessage}
              </p>
              <button
                className={classes.button}
                onClick={() => {
                  handleCardClick(ticket.uuid);
                }}
              >
                Ver Ticket
              </button>
            </div>
          ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid
        }))
      },
      ...tags.map(tag => {
        const filteredTickets = tickets.filter(ticket => {
          const tagIds = ticket.tags.map(tag => tag.id);
          return tagIds.includes(tag.id);
        });

        return {
          id: tag.id.toString(),
          title: tag.name,
          label: tag.id.toString(),
          cards: filteredTickets.map(ticket => ({
            id: ticket.id.toString(),
            label: "Ticket nº " + ticket.id.toString(),
            description: (
              <div>
                <p>
                  {ticket.contact.number}
                  <br />
                  {ticket.lastMessage}
                </p>
                <button
                  className={classes.button}
                  onClick={() => {
                    handleCardClick(ticket.uuid);
                  }}
                >
                  Ver Ticket
                </button>
              </div>
            ),
            title: ticket.contact.name,
            draggable: true,
            href: "/tickets/" + ticket.uuid
          })),
          style: { backgroundColor: tag.color, color: "white" }
        };
      })
    ];

    setFile({ lanes });
  };

  const handleCardClick = uuid => {
    //console.log("Clicked on card with UUID:", uuid);
    history.push("/tickets/" + uuid);
  };

  useEffect(() => {
    popularCards(jsonString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, tickets, reloadData]);

  const handleCardMove = async (cardId, sourceLaneId, targetLaneId) => {
    try {
      await api.delete(`/ticket-tags/${targetLaneId}`);
      toast.success("Ticket Tag Removido!");
      await api.put(`/ticket-tags/${targetLaneId}/${sourceLaneId}`);
      toast.success("Ticket Tag Adicionado com Sucesso!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <Board
        data={file}
        onCardMoveAcrossLanes={handleCardMove}
        style={{ backgroundColor: "rgba(252, 252, 252, 0.03)" }}
      />
    </div>
  );
};

export default Kanban;
